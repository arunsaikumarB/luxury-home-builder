import { VideoScrollSequence } from '@/components/video/VideoScrollSequence'
import { walkthroughSections, walkthroughVideoSrc } from '@/data/walkthrough'

export function Walkthrough() {
  return (
    <VideoScrollSequence
      videos={walkthroughSections}
      videoSrc={walkthroughVideoSrc}
      scrollVhPerSection={200}
      objectFit="cover"
    />
  )
}
