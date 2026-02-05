import { supabase } from './supabaseClient'
import { CardEvent } from '../types'

export function generateId(): string {
  return crypto.randomUUID();
}

/* ================= EVENTS ================= */

export async function getEvents(): Promise<CardEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data as CardEvent[]
}

export async function saveEvent(event: CardEvent) {
  const { error } = await supabase
    .from('events')
    .upsert(event)

  if (error) console.error('Error saving event:', error)
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) console.error('Error deleting event:', error)
}


/* ================= ROUNDS ================= */

export async function getRounds(eventId: string) {
  const { data, error } = await supabase
    .from('rounds')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching rounds:', error)
    return []
  }

  return data.map(r => r.data)
}

export async function saveRound(eventId: string, roundData: any) {
  const { error } = await supabase
    .from('rounds')
    .insert({
      id: roundData.id,
      event_id: eventId,
      data: roundData
    })

  if (error) console.error('Error saving round:', error)
}

export async function deleteRoundsForEvent(eventId: string) {
  const { error } = await supabase
    .from('rounds')
    .delete()
    .eq('event_id', eventId)

  if (error) console.error('Error deleting rounds:', error)
}
