import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import path from 'path'

async function render() {
	const compositionId = 'TDHPSShowcase'
	const entry = path.resolve('./src/remotion/index.ts')
	const outputPath = path.resolve('./test-output/tdhps_final_showcase.mp4')

	try {
		console.log('Creating output directory...')
		const fs = await import('fs')
		const outputDir = path.dirname(outputPath)
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true })
		}

		console.log('Bundling Remotion project...')
		const bundled = await bundle({
			entryPoint: entry,
			webpackOverride: (config) => config,
		})

		console.log('Selecting composition...')
		const composition = await selectComposition({
			serveUrl: bundled,
			id: compositionId,
		})

		console.log(`Rendering ${compositionId}...`)
		console.log(`Output: ${outputPath}`)

		await renderMedia({
			composition,
			serveUrl: bundled,
			codec: 'h264',
			outputLocation: outputPath,
			concurrency: 2,
		})

		console.log('Rendering complete!')
		console.log(`Output file: ${outputPath}`)

		// Get file size
		const stats = fs.statSync(outputPath)
		const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
		console.log(`File size: ${fileSizeInMB} MB`)

		// Verify with ffprobe if available
		try {
			const { execSync } = await import('child_process')
			const probeOutput = execSync(`ffprobe -v error -show_format -show_streams "${outputPath}"`)
			console.log('\nFFprobe verification:')
			console.log(probeOutput.toString().slice(0, 500))
		} catch (err) {
			console.log('ffprobe not available for verification')
		}
	} catch (error) {
		console.error('Rendering failed:', error)
		process.exit(1)
	}
}

render().catch(console.error)
