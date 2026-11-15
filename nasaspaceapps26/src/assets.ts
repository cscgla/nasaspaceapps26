/**
 * Image assets live in src/assets/figma/. Any file dropped there is picked up
 * automatically by its base name (e.g. otter-sleep.png -> "otter-sleep").
 * Missing assets render as a placeholder labelled with the file name.
 *
 * Run `npm run assets` to regenerate ASSETS.md (the export checklist).
 */
const files = import.meta.glob('./assets/figma/*.{png,jpg,jpeg,gif,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const byName: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  const base = path.split('/').pop()!.replace(/\.[^.]+$/, '')
  byName[base] = url
}

export function asset(name: AssetName): string | undefined {
  return byName[name]
}

/** Every image slot used by the app → where it is in Figma. */
export const ASSETS = {
  // Backgrounds
  'bg-iss': 'Start Page › iss-earth-rotating-loop',
  'bg-rainy': 'Singapore screens › rainy-flyer-loop-gentle-water',
  'bg-sunny-usa': 'USA screens › sunny-loop-usa',
  'bg-members': 'Members screen › background (campus)',
  'bg-cny': 'One Day Event (Chinese New Year) › background',
  'bg-raya': 'One Day Event (Hari Raya) › background',
  'bg-deepavali': 'One Day Event (Deepavali) › background',
  'bg-snowy': 'One Day Event (Christmas) › snowy-flyer-loop',
  'bg-hazy': 'One Day Event (Haze) › hazy-flyer-loop',
  'event-end': '"You Died!" screen › image 6',
  // Start page
  'card-usa': 'Start Page › USA card image',
  'card-sg': 'Start Page › Singapore card image',
  'card-event': 'Start Page › Doodle Space Agency card image',
  'nasa-logo': 'Start Page › image 9 (NASA logo)',
  // Shared UI
  'countdown-bar': 'image 1 (86 Days to home bar)',
  'speech-bubble': 'Mood Question › dropped-image 3',
  'chat-bubble-small': 'chat-bubble-small (Messages / Stats)',
  'mood-panel': 'Mood Trend › big speech bubble',
  'input-bar': 'image 3 (text box + mic + SEND)',
  'streak-fire': 'Streak › Gemini_Generated_Image_rnl0…',
  'icon-news': 'Updates › Daily Catchup icon',
  'icon-tasks': 'Updates › Today’s Tasks icon',
  'family-video': 'Message from home › Family Video',
  'note-photo-sis': 'Messages › A note from sis › photo',
  'note-photo-mum': 'Messages › A note from mum › photo',
  'note-photo-friend': 'Messages › From your best friend › photo',
  'satellite': 'Send a Note › satellite on the speech bubble',
  'toast-draft-art': 'Draft Saved! popup › otter at the mailbox shelf',
  'toast-sent-art': 'Message Sent! popup › otter at the mailbox',
  // Singapore otter
  'otter-raincoat-wave': 'SG Home › otter waving (image 25)',
  'otter-home-talk': 'SG Home animation › otter talking',
  'otter-feelings': 'SG Feelings › otter thinking',
  'otter-sleep': 'SG Sleep › otter sleeping',
  'otter-energy': 'SG Energy › otter jumping',
  'otter-food': 'SG Food › otter eating',
  'otter-social': 'SG Social › otter gesturing',
  'otter-tasks': 'SG Tasks › otter waving',
  'otter-done': 'SG Loading › otter thankful',
  'otter-stats': 'SG Mood Trend / Stats › otter with magnifier',
  'otter-messages': 'SG Messages / Send a Note › otter with envelope',
  // USA eagle
  'eagle-home': 'USA Home › eagle standing',
  'eagle-feelings': 'USA Feelings › eagle pointing',
  'eagle-sleep': 'USA Sleep › eagle sleepy',
  'eagle-energy': 'USA Energy › eagle wings out',
  'eagle-food': 'USA Food › eagle eating pizza',
  'eagle-social': 'USA Social › eagle waving',
  'eagle-tasks': 'USA Tasks › eagle',
  'eagle-done': 'USA Loading › eagle eyes closed',
  'eagle-stats': 'USA Mood Trend / Stats › eagle with magnifier',
  'eagle-messages': 'USA Messages › eagle with envelope',
  // One-day events
  'event-cny-otter': 'Chinese New Year › otter in red',
  'event-raya-otter': 'Hari Raya › otter in baju',
  'event-deepavali-otter': 'Deepavali › otter with lamp',
  'event-xmas-otter': 'Christmas › otter in coat',
  'event-xmas-tree': 'Christmas › tree',
  'event-haze-otter': 'Haze › otter with mask',
  'event-july4-jet': '4th of July › fighter jet',
  'event-july4-eagle': '4th of July › eagle with hat and flag',
} as const

export type AssetName = keyof typeof ASSETS
