import { VideoScrollSequence } from '@/components/video/VideoScrollSequence'
import { walkthroughSections } from '@/data/walkthrough'

export function Walkthrough() {
  return (
    <VideoScrollSequence
      videos={walkthroughSections}
      scrollVhPerSection={220}
      objectFit="cover"
      preloadStrategy="adjacent"
    />
  )
}
