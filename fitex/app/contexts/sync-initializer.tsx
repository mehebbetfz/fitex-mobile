// contexts/sync-initializer.tsx
import { useEffect, useRef } from 'react'
import { useAuth } from './auth-context'
import { useDatabase } from './database-context'

/**
 * Компонент-невидимка. Монтируется внутри обоих провайдеров,
 * поэтому может безопасно использовать оба хука.
 *
 * Отвечает за:
 * 1. performInitialSync — при первом входе / смене пользователя
 * 2. syncUnsyncedData   — при старте приложения если уже залогинен
 */
export const SyncInitializer = () => {
	const { user } = useAuth()
	const { performInitialSync, syncUnsyncedData, isInitialized } = useDatabase()

	const lastSyncedUserId = useRef<string | null>(null)
	const hasSyncedOnStartup = useRef(false)

	// Срабатывает когда пользователь залогинился (или сменился аккаунт)
	useEffect(() => {
		if (!user || !isInitialized) return
		if (!user.isPremium) return

		// Если это новый пользователь — делаем полную двустороннюю синхронизацию
		if (lastSyncedUserId.current !== user.id) {
			lastSyncedUserId.current = user.id
			console.log('[Sync] New user detected, performing initial sync...')
			performInitialSync(user.isPremium)
			hasSyncedOnStartup.current = true // считаем что уже синхронизировали
		}
	}, [user?.id, isInitialized])

	// Срабатывает один раз при старте если пользователь уже был залогинен
	useEffect(() => {
		if (!user || !isInitialized) return
		if (!user.isPremium) return
		if (hasSyncedOnStartup.current) return // уже запустили через первый useEffect

		hasSyncedOnStartup.current = true
		console.log('[Sync] App startup, syncing unsynced data...')
		syncUnsyncedData(user.isPremium)
	}, [isInitialized])

	return null
}
