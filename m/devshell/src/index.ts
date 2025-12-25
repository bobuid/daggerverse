import { dag, object, func } from '@dagger.io/dagger'
import type { Container, Directory, Secret, Service, Platform } from '@dagger.io/dagger'
import {
  typedConfigSchema,
  zBuildConfigPlatformDefaults,
  buildConfigMultiliners,
} from './config-shema-and-defaults'

@object()
export class BdDevShell {

  @func()
  async devContainer (
    buildConfigToml?: File,
    prototoolsFile?: File,
    platform: Platform = zBuildConfigPlatformDefaults.platforms[0] as unknown as Platform,
  ): Promise<Container> {
    // const src = dag
    //   .currentModule().source().directory('/')

    const ctnr = await devContainer_(buildConfigToml, prototoolsFile, platform)
    return ctnr
  }

  @func()
  async devContainerwExportImage ( // @TODO does not work yet!!! (options parsing fails)
    buildConfigToml?: File,
    prototoolsFile?: File,
    platforms: Platform[] = zBuildConfigPlatformDefaults.platforms as unknown as Platform[],
    name: string = zBuildConfigPlatformDefaults.imageName,
  ): Promise<void> {
    const ctnr = await this.devContainer(buildConfigToml, prototoolsFile, platforms[0])
    return ctnr.exportImage(
      name, {
        platforms
    })
  }
}

async function devContainer_ (
  buildConfigToml?: File,
  prototoolsFile?: File,  // @TODO allow plugins
  platform: Platform = zBuildConfigPlatformDefaults.platforms[0] as unknown as Platform,
): Promise<Container>
{
  const config =
      await typedConfigSchema(
        Bun.TOML.parse( // @TODO 'smol-toml'.parse if bun fails on difficult cases
          await buildConfigToml?.contents()
    ))
  const configComment = config.misc?.comment

  const {
    baseImage, // platforms,
    baseAptPackages, extraAptPackages, egetPackages,
  } = config.platform

  const {
    userName, userId, userGroupName, userGroupId20,
    workRootPath, workFolderPath, userHomePath, userBinPath,
    protoHomePath, sshAgentPath
  } = config.land

  // ## Base platform, extra packages and land

  const userHomePrototypesPath = workRootPath + '/prototypes-for-' + userName

  let ctnr = dag
    .container({
      platform
    })
    .from(baseImage)
    .withExec(["apt", "update"])
    .withExec(["apt", "install", "-y", "--no-install-recommends",
      ...baseAptPackages,
      ...(extraAptPackages || [])
    ])
    .withExec(["rm", "-rf", "/var/lib/apt/lists/*"])
    // .withEnvVariable(
    //   "PATH",
    //   `/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`,
    //   { expand: true }
    // )
    .withExec(['sh', '-c',`set -e && \
      mkdir -p ${workFolderPath} ${userBinPath} ${protoHomePath} ${userHomePrototypesPath} && \
      groupadd ${userGroupName} && \
      useradd -u ${userId} -g ${userGroupId20} -d ${userHomePath} --shell $(which zsh) ${userName} && \
      usermod -aG sudo -aG ${userGroupName} ${userName} && \
      echo "${userName} ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers  && \
      chown -R ${userName}:${userGroupName} ${workFolderPath} && \
      chown ${userName}:${userGroupName} ${userBinPath} && \
      chown ${userName}:${userGroupName} ${userHomePrototypesPath} && \
      chown ${userName}:${userGroupName} ${protoHomePath}
    `])
    //- @TODO check the role of set -e, besides that thus we can load evn vars easily
    //- sshAgentPath should be created as mount of the socket dynamically by compose, so
    //- its ownership we force it in the entrypoint script
    .withWorkdir(workFolderPath)
  await ctnr.sync()

  // ### With eget

  if (!!egetPackages) {

    const _pkgs = 
    // egetPackages?.map(pkg => 
    //   `'${pkg}'`
    // ).join(' ')
    egetPackages?.join('\n') || ''

    ctnr = ctnr
      .withUser(userName)
      .withEnvVariable(
        "PATH",
        `${userBinPath}:$PATH`,
        { expand: true }
      )
    await ctnr.sync()

    ctnr = ctnr
      .withUser(userName)
      .withExec(["sh", "-c", `
        cd ${userBinPath} && \
        curl https://zyedidia.github.io/eget.sh | sh
      `])
      .withExec(["bash", "-c", `
          set -eu
          while IFS= read -r pkg_line; do
            eget $pkg_line
          done
        `,
      ], { stdin: _pkgs })
    await ctnr.stdout()
  }

  // ### With prototools and other userland stuff

  // const zshPrompt = dag.currentModule().source().file('../shared/prompt.zshrc')

  ctnr = ctnr
    .withUser(userName)
    .withEnvVariable(
      "PATH",
      `${protoHomePath}/bin:${protoHomePath}/shims:$PATH`,
      { expand: true }
    )
    .withNewFile(
      `${userHomePrototypesPath}/.zshrc`,
      buildConfigMultiliners.zshRc
    ) // ([[ -f "${userHomePath}/.zshrc" ]] || cat <<<"${buildConfigMultiliners.zshRc}" > ${userHomePath}/.zshrc) && \
  await ctnr.sync()

  ctnr = ctnr
    .withUser(userName)
    .withEnvVariable("PROTO_HOME", protoHomePath)
    //- note that we dont use mise due to a grade more difficult install than the proto's
    //- @TODO introduce mise
    .withExec(["sh", "-c", `
      curl -fsSL https://moonrepo.dev/install/proto.sh | bash
    `])
    .withNewFile(
      workRootPath + '/.prototools',
      await prototoolsFile?.contents() + `\n` + buildConfigMultiliners.prototoolsConfigBase + '\n' + configComment
    )
    .withExec(["proto", "use"])
  await ctnr.stdout()

  // ### Outro

  return ctnr
    .withUser(userName)
    .withEntrypoint(["bash", "-c", `
      [[ -f "${sshAgentPath}" ]] && sudo chown ${userName} ${sshAgentPath}; \
      [[ -f "${userHomePath}/.zshrc" ]] || \ 
      (sudo cp ${userHomePrototypesPath}/.zshrc ${userHomePath}/ && sudo chown ${userName} ${userHomePath}/.zshrc ); \
      exec $(which zsh)
    ` /* .replaceAll('√','$') */])
    // NOTE: on the host we need to perform ssh-add ~/.ssh/github-key in order to ssh-agent access to work
    // test with: ssh -T git@github.com (~/.ssh-agent.socket needs to be owned by bob)
}
