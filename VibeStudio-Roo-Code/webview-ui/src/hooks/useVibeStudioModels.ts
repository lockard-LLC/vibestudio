import { useState, useEffect } from "react"
import { ModelInfo, vibestudioDefaultModelId, vibestudioDefaultModelInfo, VIBESTUDIO_URL } from "../../../src/shared/api"
import type { ApiConfiguration } from "../../../src/shared/api"

export const useVibeStudioModels = (apiConfiguration?: ApiConfiguration) => {
	const [vibestudioModels, setVibeStudioModels] = useState<Record<string, ModelInfo>>({
		[vibestudioDefaultModelId]: vibestudioDefaultModelInfo,
	})

	useEffect(() => {
		const fetchVibeStudioModels = async () => {
			try {
				const res = await fetch(`${VIBESTUDIO_URL}/getVibeStudioAgentModels`)
				if (!res.ok) throw new Error("Failed to fetch models")
				const config = await res.json()

				if (config.models && Object.keys(config.models).length > 0) {
					console.log("Models successfully loaded from server")
					setVibeStudioModels(config.models)
				}
			} catch (error) {
				console.error("Error fetching VibeStudio models:", error)
			}
		}

		if (apiConfiguration?.apiProvider === "vibestudio") {
			fetchVibeStudioModels()
		}
	}, [apiConfiguration?.apiProvider])

	return vibestudioModels
}
