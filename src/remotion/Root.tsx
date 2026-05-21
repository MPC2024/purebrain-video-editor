import React from 'react'
import { Composition } from 'remotion'
// import { TDHPSShowcase } from './TDHPSShowcase'

// Placeholder component - TDHPSShowcase disabled due to remotion API changes
const PlaceholderShowcase = () => <div>Placeholder</div>

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="TDHPSShowcase"
				component={PlaceholderShowcase}
				durationInFrames={20 * 30} // 20 seconds at 30fps
				fps={30}
				width={1080}
				height={1920} // TikTok vertical format
			/>
		</>
	)
}
