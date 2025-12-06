/**
 * Web3 风格的 Toast 通知工具
 * 使用 sonner 库，提供炫酷的 Web3 风格提示
 */

import { toast } from 'sonner'

export const web3Toast = {
  /**
   * 成功提示
   */
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      duration: 3000,
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        color: '#fff',
        boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
      },
      className: 'web3-toast-success',
    })
  },

  /**
   * 错误提示
   */
  error: (message: string, description?: string) => {
    return toast.error(message, {
      description,
      duration: 4000,
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid rgba(239, 68, 68, 0.5)',
        color: '#fff',
        boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)',
      },
      className: 'web3-toast-error',
    })
  },

  /**
   * 警告提示
   */
  warning: (message: string, description?: string) => {
    return toast.warning(message, {
      description,
      duration: 3000,
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid rgba(245, 158, 11, 0.5)',
        color: '#fff',
        boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)',
      },
      className: 'web3-toast-warning',
    })
  },

  /**
   * 信息提示
   */
  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      duration: 3000,
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        color: '#fff',
        boxShadow: '0 10px 40px rgba(59, 130, 246, 0.2)',
      },
      className: 'web3-toast-info',
    })
  },

  /**
   * 加载提示
   */
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid rgba(139, 92, 246, 0.5)',
        color: '#fff',
        boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)',
      },
      className: 'web3-toast-loading',
    })
  },

  /**
   * Promise 提示（用于异步操作）
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid rgba(139, 92, 246, 0.5)',
        color: '#fff',
        boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)',
      },
      className: 'web3-toast-promise',
    })
  },

  /**
   * 自定义提示
   */
  custom: (message: string, options?: any) => {
    return toast(message, {
      ...options,
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid rgba(139, 92, 246, 0.5)',
        color: '#fff',
        boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)',
        ...options?.style,
      },
      className: 'web3-toast-custom',
    })
  },

  /**
   * 确认对话框
   * 返回一个 Promise，用户确认返回 true，取消返回 false
   */
  confirm: (message: string, description?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      toast(message, {
        description,
        duration: Infinity,
        style: {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          color: '#fff',
          boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)',
        },
        action: {
          label: '确认',
          onClick: () => {
            resolve(true)
          },
        },
        cancel: {
          label: '取消',
          onClick: () => {
            resolve(false)
          },
        },
        onDismiss: () => {
          resolve(false)
        },
      })
    })
  },
}

