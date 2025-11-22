import { CDPCommand, CDPEvent, ProtocolMapping } from '../cdp-types.js'

export const VERSION = 1

type ForwardCDPCommand =
  {
    [K in keyof ProtocolMapping.Commands]: {
      id: number
      method: 'forwardCDPCommand'
      params: {
        method: K
        sessionId?: string
        params?: ProtocolMapping.Commands[K]['paramsType'][0]
      }
    }
  }[keyof ProtocolMapping.Commands]

export type ExtensionCommandMessage =
  | {
      id: number
      method: 'attachToTab'
    }
  | ForwardCDPCommand

export type ExtensionResponseMessage = {
  id: number
  result?: any
  error?: string
}

/**
 * This produces a discriminated union for narrowing, similar to ForwardCDPCommand,
 * but for forwarded CDP events. Uses CDPEvent to maintain proper type extraction.
 */
export type ExtensionEventMessage =
  {
    [K in keyof ProtocolMapping.Events]: {
      method: 'forwardCDPEvent'
      params: {
        method: CDPEvent<K>['method']
        sessionId?: string
        params?: CDPEvent<K>['params']
      }
    }
  }[keyof ProtocolMapping.Events]

export type ExtensionLogMessage = {
  method: 'log'
  params: {
    level: 'log' | 'debug' | 'info' | 'warn' | 'error'
    args: string[]
  }
}

export type ExtensionMessage = ExtensionResponseMessage | ExtensionEventMessage | ExtensionLogMessage
