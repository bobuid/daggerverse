import type { Platform, Directory, Secret, Service } from '@dagger.io/dagger'
import { z, ZodString } from 'zod'

// const zPlatfom: z.ZodType<Platform> = z.enum(['linux/amd64' as Platform]);

export const zBuildConfigPlatformDefaults: Record<'baseImage'|'imageName'|'ctnrName',string> & {
  platforms: Platform[],
  ctnrPorts: number[],
  ctnrPortsOff: boolean,
  folderNames: Record<string,string>,
  baseAptPackages: string[],
  extraAptPackages?: string[],
  egetPackages?: string[],
} = {
  baseImage: 'debian:12-slim',
  platforms: [
    'linux/amd64' as Platform
  ],
  imageName: 'devshell',
  ctnrName: 'devshell-0',
  ctnrPorts: [
    45070, 45071, 45072, 45073, 45074, 45075,
    //- see the finishing part, assuming 6 ports
    //- @TODO port ranges
  ] as number[],
  ctnrPortsOff: false,
  folderNames: {
    work: 'app',
    proto: '.proto',
    userBin: 'bin',
    mise: '.mise',
    'ssh-agent-socket': '.ssh-agent.socket'
  },
  baseAptPackages: [
    "sudo", "curl", "xz-utils", "bash", // base base
    "zsh", "bat", "fzf", // devops base comfort tools
    "openssh-client", "ca-certificates",  // comm base
  ],
  extraAptPackages: [] as string[]|undefined,
  egetPackages: [] as string[]|undefined,
} // as const

export const zBuildConfigPlatformSchema = z.object({
  baseImage: z.string().default(zBuildConfigPlatformDefaults.baseImage),
  platforms: z.array(z.custom<Platform>()).default(zBuildConfigPlatformDefaults.platforms as unknown as Platform[]),
  //- zod does no effective validation here
  imageName: z.string().default(zBuildConfigPlatformDefaults.imageName),
  ctnrName: z.string().default(zBuildConfigPlatformDefaults.ctnrName),
  ctnrPorts: z.array(z.number()).default(zBuildConfigPlatformDefaults.ctnrPorts),
  ctnrPortsOff: z.boolean().default(zBuildConfigPlatformDefaults.ctnrPortsOff),
  folderNames: z.record(z.string(),z.string()).default(zBuildConfigPlatformDefaults.folderNames), // @TODO specify
  baseAptPackages: z.array(z.string()).default(zBuildConfigPlatformDefaults.baseAptPackages),
  extraAptPackages: z.array(z.string()).optional(),
  egetPackages: z.  array(z.string()).optional()
})

export const zBuildConfigLandDefaults = {
  userName: 'bob',
  userId: 501,
  userGroupName: 'bobz',
  userGroupId20: 20,
  workRootPath: '/work',
} as const

export const zBuildConfigLandSchema = z.object({
  userName: z.string().default(zBuildConfigLandDefaults.userName),
  userId: z.number().int().positive().default(zBuildConfigLandDefaults.userId),
  userGroupName: z.string().default(zBuildConfigLandDefaults.userGroupName),
  userGroupId20: z.number().int().positive().default(zBuildConfigLandDefaults.userGroupId20),
  workRootPath: z.string().default(zBuildConfigLandDefaults.workRootPath),
  workFolderPath: z.string().optional(),  // @TODO now only no trailing /-s
  userHomePath: z.string().optional(),
  userBinPath: z.string().optional(),
  protoHomePath: z.string().optional(),
  sshAgentPath: z.string().optional(),
})

export const zBuildConfigSchema = z.object({

  // the custom settings of the below env compatible settings
  // (which actually are loaded via source and used in docker compose files)
  // prevail over the corresponding platform section settings in that these are loaded to the env
  // and overwrite the platform section siblings
  DEVSHELL_IMAGE_NAME: z.string().default(zBuildConfigPlatformDefaults.imageName),
  DEVSHELL_CTNR_NAME: z.string().default(zBuildConfigPlatformDefaults.ctnrName),
  DEVSHELL_CTNR_PORT0: z.number().int().positive().default(zBuildConfigPlatformDefaults.ctnrPorts[0]),
  DEVSHELL_CTNR_PORT1: z.number().int().positive().default(zBuildConfigPlatformDefaults.ctnrPorts[1]),
  //- @TODO check if the env compatible settings are actually env compatible, like no spaces

  platform: zBuildConfigPlatformSchema.default(zBuildConfigPlatformDefaults),
  land: zBuildConfigLandSchema.default(zBuildConfigLandDefaults),

  prototools: z.record(z.string(), z.string()).optional(),

  misc: z.object({
    comment: z.string()
  })

}).transform((unfinished) => ({
  ...unfinished,
  DEVSHELL_CTNR_PORT0: unfinished.platform.ctnrPortsOff
    ? undefined
    : unfinished.DEVSHELL_CTNR_PORT0,
  DEVSHELL_CTNR_PORT1: unfinished.platform.ctnrPortsOff
    ? undefined
    : unfinished.DEVSHELL_CTNR_PORT1,
  // @TODO the other ports
  platform: {
    ...unfinished.platform,
    imageName: unfinished.DEVSHELL_IMAGE_NAME,
    //- if env compatible settings were not defined originally, then here we only overwrite with the originally set value
    //- otherwise the env compatible version wins
    ctnrName: unfinished.DEVSHELL_CTNR_NAME,
    ctnrPorts: unfinished.platform.ctnrPortsOff
      ? []
      : [
        unfinished.DEVSHELL_CTNR_PORT0 || unfinished.platform.ctnrPorts[0],
        unfinished.DEVSHELL_CTNR_PORT1 || unfinished.platform.ctnrPorts[1],
        ...unfinished.platform.ctnrPorts.slice(2)
      ]
  },
  land: {
    ...unfinished.land,
    workFolderPath: unfinished.land.workFolderPath || unfinished.land.workRootPath + '/' + zBuildConfigPlatformDefaults.folderNames.work,
    userBinPath: unfinished.land.userBinPath || unfinished.land.workRootPath + '/' + zBuildConfigPlatformDefaults.folderNames.userBin,
    protoHomePath: unfinished.land.protoHomePath || unfinished.land.workRootPath + '/' + zBuildConfigPlatformDefaults.folderNames.proto
  }
})).transform((unfinished) => ({
  ...unfinished,
  land: {
    ...unfinished.land,
    userHomePath: unfinished.land.userHomePath || unfinished.land.workFolderPath + '/.' + unfinished.land.userName
  }
})).transform((unfinished) => ({
  ...unfinished,
  land: {
    ...unfinished.land,
    sshAgentPath: unfinished.land.sshAgentPath || unfinished.land.userHomePath + '/' + zBuildConfigPlatformDefaults.folderNames['ssh-agent-socket'],
  }
}))

export type BdBuildConfig = z.infer<typeof zBuildConfigSchema>

export async function typedConfigSchema ( // throws
  untypedConfig: Object
): Promise<BdBuildConfig>
{
  try {
    return zBuildConfigSchema.parse(untypedConfig)
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('Invalid configuration:', err.errors);
    } else {
      console.error('Failed to load configuration:', err);
    }
    throw err
  }
}

export const buildConfigMultiliners = {

prototoolsConfigBase: `

  [settings]
  auto-install = true

  [plugins]
  gh = "source:https://raw.githubusercontent.com/appthrust/proto-toml-plugins/main/gh/plugin.toml"
`.replaceAll('\n  ','\n'),

zshRc: String.raw`
  autoload -Uz vcs_info
  precmd() { vcs_info }
  zstyle ':vcs_info:git:*' formats '%b '
  setopt PROMPT_SUBST
  PROMPT='%F{red}dsh:%f%F{blue}%~%f %F{red}[$]{vcs_info_msg_0_}%f$ '
`.normalize('NFC').replaceAll('[$]', '$').replaceAll('\n  ','\n').replace(/"/g, '\\"')
}
