import { http } from '@/utils/request'

export interface Family {
  id: string
  name: string
  inviteCode: string
  createdById: string
  members: FamilyMember[]
}

export interface FamilyMember {
  id: string
  familyId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  user: {
    id: string
    nickname: string
    avatarUrl?: string
    role: 'child' | 'parent'
  }
}

export const createFamily = (data: { name: string }) => {
  return http.post<Family>('/families', data)
}

export const getMyFamilies = () => {
  return http.get<Family[]>('/families/my')
}

export const getFamilyDetail = (id: string) => {
  return http.get<Family>(`/families/${id}`)
}

export const joinFamily = (data: { inviteCode: string }) => {
  return http.post<Family>('/families/join', data)
}
