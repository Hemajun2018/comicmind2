import { createClient } from './client'
import type { Database } from './types'

// 客户端工具函数
export const supabase = createClient()

// 获取当前用户
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// 获取用户资料
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// 更新用户资料
export async function updateUserProfile(
  userId: string, 
  updates: Database['public']['Tables']['profiles']['Update']
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 获取用户的思维导图
export async function getUserMindmaps(userId: string) {
  const { data, error } = await supabase
    .from('mindmaps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// 创建思维导图
export async function createMindmap(
  mindmap: Database['public']['Tables']['mindmaps']['Insert']
) {
  const { data, error } = await supabase
    .from('mindmaps')
    .insert(mindmap)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 更新思维导图
export async function updateMindmap(
  mindmapId: string,
  updates: Database['public']['Tables']['mindmaps']['Update']
) {
  const { data, error } = await supabase
    .from('mindmaps')
    .update(updates)
    .eq('id', mindmapId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 删除思维导图
export async function deleteMindmap(mindmapId: string) {
  const { error } = await supabase
    .from('mindmaps')
    .delete()
    .eq('id', mindmapId)
  
  if (error) throw error
}

// 获取公开的思维导图
export async function getPublicMindmaps() {
  const { data, error } = await supabase
    .from('mindmaps')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// 检查用户每日使用限制
export async function checkDailyLimit(userId?: string, ipAddress?: string) {
  const { data, error } = await supabase.rpc('check_daily_limit', {
    user_uuid: userId || null,
    user_ip: ipAddress || null
  })
  
  if (error) {
    console.error('检查每日限制时发生错误:', error);
    // 如果检查失败，默认允许使用
    return true;
  }
  return data as boolean
}

// 记录使用量
export async function recordUsage(userId?: string, ipAddress?: string) {
  const { error } = await supabase.rpc('record_usage', {
    user_uuid: userId || null,
    user_ip: ipAddress || null
  })
  
  if (error) {
    console.error('记录使用量时发生错误:', error);
    throw error;
  }
}

// 获取用户订阅信息
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 是没有找到记录的错误
  return data
}

// 注意：服务端工具函数应该在 API 路由中直接导入 server.ts
// 这里不导入服务器组件以避免客户端/服务器组件冲突 