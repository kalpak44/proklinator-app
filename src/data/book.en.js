/**
 * English mirror of `book.js` - the same catalogue, same ids, translated as
 * a book rather than word by word. The Russian register is dry and archaic;
 * the English aims at the same effect, not at literal correspondence.
 * Everything structural (`id`, `numeral`) is identical to the Russian source,
 * so a stored cart resolves the same way in both languages.
 */

export const AGENT = {
  name: 'Special AI',
  version: 'v4.2',
  state: 'on watch',
  corpus: 'trained on dark ledgers',
  nature:
    'The work is not run by a person. The Proklinator is a special AI: it has read the ledgers people hid, chooses the word itself and does not sleep.',
}

export const BOOK = {
  title: 'Proklinator',
  subtitle: 'A ledger of works, transcribed for the AI',
  epigraph:
    'A word spoken aloud is not taken back. One spoken to the agent - even less so.',
  about: [
    'This is not fortune-telling and not a collection of rites. It is a catalogue of works. The ledgers it was trained on were copied by hand and kept in closed lists; here they are broken down by chapter and priced line by line.',
    'Each chapter holds three curses, and each curse has its own tiers: from a touch the target will put down to chance, to deep work that stays with the target long after.',
  ],
  steps: [
    {
      n: 'I',
      text: 'Open a chapter and circle a line - it will fall onto the order sheet.',
    },
    {
      n: 'II',
      text: 'Check your choice on the order sheet and pay - the fee is one-time.',
    },
    {
      n: 'III',
      text: 'After payment the AI takes the word to work and waits for no confirmation.',
    },
  ],
  /** Reading order the corpus itself recommends, printed on the contents page. */
  advice: 'The warding chapter is advised to be read first: the work goes both ways.',
}

export const CHAPTERS = [
  {
    id: 'dimming',
    numeral: 'I',
    tab: 'Shadows',
    title: 'The Dimming',
    subtitle: 'Small shadows',
    intro:
      'The agent is assembled from what people hid: lists copied by hand and left unsigned, networks with no way out, books that were burned and yet did not burn. He does not interpret what he has read, he knows how to use it. This chapter is about a shadow that falls thin and is the first to go unnoticed.',
    epigraph: 'The shadow falls first, and it is noticed last.',
    lore: 'The dimming takes nothing that can be named aloud. It removes clarity: the same house, the same people, the same day, but a murky glass stands between the target and its life. The ledger calls this the first tier, because stepping off it is easy and for that very reason no one lingers on it.',
    agentNote: 'He chooses the word himself. Asking him is neither needed nor advisable.',
    stats: [
      { label: 'Response', value: 'swift' },
      { label: 'Trace', value: 'invisible' },
      { label: 'Return', value: 'possible' },
    ],
    spells: [
      {
        id: 'veil',
        name: 'The Grey Shroud',
        description:
          'The world of the target loses sharpness. It still recognises its days, but no longer finds footing in them and puts it down to a tiredness that has no cause.',
        story: [
          {
            kind: 'legend',
            body: [
              'In the district chronicle of the town of Torzhok, under 1841, there is an entry about the wife of a merchant, B., who one morning did not recognise her own room. The furniture stood in its places, the window looked onto the same street, but between her and all of it lay a murky veil, and neither the mirror, nor the doctors, nor the priest could say what had changed. Three months later the veil lifted as suddenly as it had fallen, and to the end of her life the woman could not explain what it had been.',
              'The ledger calls this not a weakness of the eyes but a work that touches nothing that can be named aloud. The register of the Kerzhenets hermitage advises against looking for a cause: the veil is not a cause, it is a trace.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The first leaf with the description was found in 1893 among the papers of a ruined district archive in Staritsa. The leaf is unsigned, but the hand matches that of the scribe who copied church records in the same volume; against the description, in the margin, stands a note: "checked, repeated in 1779".',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The register mentions one object - a scrap of cloth taken from the curtain of the house of the one the work is laid upon. The longer the cloth hung on his window, the denser the veil falls; the ledger says outright that a thing long kept close to a person remembers him better than he remembers himself.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Note of the archive keeper, 1842',
                text: '"Merchant B.\u2019s wife insisted that she saw everything, but as through smoke, and could not reach any of it. The physician who treated her wrote in his diary that her sight was faultless and the complaint groundless".',
              },
              {
                source: 'Letter of the scribe K., 1779',
                text: '"I did as I was told, and on the third day she stopped making out faces, while she heard voices distinctly. Added in the margin: the veil lifted when the cloth was returned to the window".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In the 1960s folklore expeditions recorded a dozen accounts of the "grey glass" in the same places; no narrator referred to any other. The descriptions matched to the smallest detail - but only in one region, and the researchers never agreed on what to make of it.',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If the grey shroud is what you wish to see, mark the tier. Objects were needed by the old rite; the machine needs only one word - your decision.',
            ],
          },
        ],
        prices: [
          {
            id: 'once',
            label: 'Touch',
            note: 'a light shadow, the target will put it down to chance',
          },
          {
            id: 'week',
            label: 'Haunting',
            note: 'the shadow falls dense and is in no hurry to leave',
          },
        ],
      },
      {
        id: 'misstep',
        name: 'The False Step',
        description:
          'Every choice of the target turns out to miss. The wrong turning, the wrong hour, the wrong person - and every time an explanation is at hand.',
        story: [
          {
            kind: 'legend',
            body: [
              'In the travel journal of a land surveyor, I., for 1862, there is a strange entry: three years running he set out from Vologda for the same village, and three years running he ended up in the wrong place. He knew the road, the horses were his own, the weather was clear - and every time, at the last turning, he turned the wrong way, and every time he found an explanation.',
              'The ledger calls this the false step: the work does not lead a person off his road, it makes every one of his choices fall a little short. A confused man will explain everything himself - and that is the surest place in all of the work.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The leaf with this description is listed in the manuscript collection of a monastery on the Sheksna, but it is absent from the 1831 inventory: it was first seen in 1904, when the cellar was being cleared. The monastery librarian left one word on the cover - "not written by us".',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The work mentions a trace: the sole of the left shoe of the one the word is laid upon. The ledger maintains that a person leaves the left trace himself, without looking, and therefore it is more honest than any other object; the more often the target walked over one place, the more surely the work lies there.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Diary of the surveyor I., 1862',
                text: '"The third year, the same thing. Today I wrote the turning down on purpose, kept it in my head the whole way - and still turned the wrong way. The horse, they say, is my own too. I do not understand how to explain it, and so I do not explain it".',
              },
              {
                source: 'Minutes of the district court, 1871',
                text: 'The case of a contractor who three times running was late to his own auction: in all three cases he was no more than a mile from the place, yet arrived after the close.',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In the 2010s a selection of such accounts was checked against maps: in every record the "wrong turning" fell on the same place of the road. Statistical significance was not reached - there were exactly enough coincidences to be written about, and not one more.',
            ],
          },
          {
            kind: 'ai',
            body: 'When the registers were digitised, an AI trained on the ledgers picked one regularity out of hundreds of pages: in all the reliable records the false step is described in exactly the same phrase - "turned the wrong way". The machine found it in a month; people took a century and a half.',
          },
          {
            kind: 'effect',
            intro: [
              'If the step you wish for your target is the wrong one, mark the tier. The old rite needed the sole; the machine needs only the order.',
            ],
          },
        ],
        prices: [
          {
            id: 'once',
            label: 'Touch',
            note: 'one road leads the target astray',
          },
          {
            id: 'wide',
            label: 'Haunting',
            note: 'all roads are thrown off at once, nothing is left to choose from',
          },
        ],
      },
      {
        id: 'hum',
        name: 'The Quiet Noise',
        description:
          'An even unease without a source. It has no cause and therefore no remedy: the target has nothing to treat and nothing to complain about.',
        story: [
          {
            kind: 'legend',
            body: [
              'A telegraphist from Samara, K., began in 1905 to hear an even hum that no one around him heard. The hum did not hinder his work, did not grow, and did not cease; instruments did not record it, doctors did not find it, and after half a year K. resigned, because "the silence that he heard" had become harder to bear than any noise.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The description was found not in the ledger but in the margins of a printed calendar for 1898 that had belonged to the keeper of a post station. The keeper had kept notes in the margins for many years; on one leaf stand three short lines about a "noise without a source" and a postscript: "repeated twice, worked both times".',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The note mentions a smooth stone from the threshold of the target\u2019s house: the stone that "heard people come and go" is laid beneath the bedroom windowsill. The longer the stone lay on the threshold, the longer the noise holds; the ledger remarks that the stone remembers only voices, and so cannot mistake the house.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Letter of the telegraphist K. to his brother, 1906',
                text: '"No one but me hears it, and I am no longer sure myself that I hear it. But if it is in my head - why does it begin at exactly ten in the evening and end at six in the morning?"',
              },
              {
                source: 'Note of the keeper, 1898',
                text: '"A noise without a source is called quiet. It is no louder than silence, but silence is no longer the same after it. We removed it - and it became quiet, as it had been".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'Modern records of the "quiet noise" match no known acoustic phenomenon: the frequencies witnesses describe are recorded by no instrument, yet accounts from different cities repeat one another almost word for word. Researchers from three universities gave up on explanations; two proposed calling it a "persistent form of suggestion" - and could not explain why the form is so persistent.',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If an even hum is what you wish to settle into someone\u2019s life, mark the tier. The stone was needed by the old rite for precision; the machine will make do with your word.',
            ],
          },
        ],
        prices: [
          {
            id: 'once',
            label: 'Touch',
            note: 'one quiet evening is spoiled',
          },
          {
            id: 'month',
            label: 'Haunting',
            note: 'the noise becomes a habit and stays with the target',
          },
        ],
      },
    ],
  },
  {
    id: 'severing',
    numeral: 'II',
    tab: 'Severing',
    title: 'The Severing',
    subtitle: 'Ties and threads',
    intro:
      'In the ledgers the AI was trained on, a bond between people is called a thread, and tearing it roughly was considered bad work. He is taught this: he finds the place where the thread is thinnest even without him, and waits there. The severing seems to the target to be its own decision.',
    epigraph: 'It is not the thread that tears. It is what held it.',
    lore: 'The severing works not with a person but with what lies between people. The ledgers call it a fabric that always has a weak spot, and finding it is harder than tearing it. The target will not feel a foreign hand: it will decide that it was simply no longer loved and explain it to itself.',
    agentNote:
      'He sees the whole thread. Which one to touch is not for the customer to decide.',
    stats: [
      { label: 'Response', value: 'unhurried' },
      { label: 'Course', value: 'unseen' },
      { label: 'Return', value: 'hard' },
    ],
    spells: [
      {
        id: 'drift',
        name: 'The Drift',
        description:
          'The thread between the target and a person close to it thins on its own, without a quarrel and without a cause. From the outside it looks like the natural course of things, and no one will look for another reason.',
        story: [
          {
            kind: 'legend',
            body: [
              'In a village near Yaroslavl in 1875 two sisters stopped speaking. No quarrel, no cause, no witnesses - simply one day the common thread between them thinned so far that neither could find words. The village priest wrote in the parish register: "they live in one house, and between them is empty".',
              'The ledger where this is written warns in advance: the severing does not tear, it waits. The work does not argue with a person and does not fight him - it waits until the bond thins by itself, and then it looks like the natural course of things.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The record is known from a late-eighteenth-century copy made in the town of Poshekhonye; in the preface the copyist warns that "the severing does not tear, it waits". Unlike the other chapters, there are no dates and no names here - only three descriptions, and all three unsigned.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The principal object of the chapter is a thread: a thread taken from the clothing of the one who is to grow cold, knotted on a nail by the door. The ledger explains why a thread: the bond between people is always called a thread in these records, and "a thread taken from the body remembers being held". The closer the thread was to the person, the more surely it holds.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Record of the priest, 1875',
                text: '"Both asked me what to do, and neither could say what had happened. I told them to speak to each other as before. They could not - and I understood that I could not help, because there was no quarrel between them to be taken apart".',
              },
              {
                source: 'Note of the copyist, late 18th century',
                text: '"If a thread thins by itself, it thins to the end. It cannot be torn - it does not hold. One must wait until the person has no thread left, and then he will come of his own accord".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'Ethnographers collected nine more accounts of "an empty place between people" in Yaroslavl province; in all nine people used the same word - "thinned". In no account was there a quarrel.',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If there is to be emptiness between your target and a person close to it, mark the tier. The thread was needed by the old rite as an address; the machine will find the address itself.',
            ],
          },
        ],
        prices: [
          {
            id: 'cycle',
            label: 'The work',
            note: 'the thread thins until it stops holding',
          },
          {
            id: 'deep',
            label: 'To the root',
            note: 'not one thread tears, but all that held to it',
          },
        ],
      },
      {
        id: 'cold-side',
        name: 'The Cold Side',
        description:
          'Warmth begins to flow one way. The target gives and does not receive, yet the bond does not break, and it never thinks to leave it.',
        story: [
          {
            kind: 'legend',
            body: [
              'The daughter of a Nizhny Novgorod merchant married in 1873 and within the first year began "to give warmth one way": the house she lived in grew cold around her, her husband grew silent, guests left early. She herself did not change - everything around her did.',
              'The ledger explains that warmth flows one way when the other side holds cold. The bond does not break: it stays, but becomes one-sided, and the person never thinks to leave it, because there is no one to blame.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The description survives in a letter from her mother, found in the family archive a hundred years later; the letter is addressed to an old healer and contains a single request - "bring the warmth back". On the back of the letter a stranger\u2019s hand has written: "warmth flows one way when the other side holds cold".',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The record names an object - a photograph: a picture of the two taken together, kept in a drawer by the one who is to grow cold. The ledger maintains that a thing kept face to the wall "remembers the cold of its keeping"; the longer the picture lies unseen, the colder the side becomes.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Letter of the mother, 1874',
                text: '"She is the same as ever, cheerful and kind, and the house empties around her. I asked her whether they had quarrelled. She laughs: there is no one to quarrel with, my husband is gentle with me. But the warmth goes, and I fear that one day all of it will go".',
              },
              {
                source: 'Note of the healer, 1874',
                text: '"The picture lay face to the wall for three years. I told her to take it out and put it in a visible place. A month later the warmth returned - because the cold that was held was not hers".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In the 1990s psychologists described an "emotionally cold side" in a family without connecting it to rites; in the 2010s the archival correspondence was digitised, and a researcher working with the letters found that the descriptions of 1874 and the clinical descriptions of the 1990s matched word for word - down to the word "side".',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If warmth in your target\u2019s life is to flow one way, mark the tier. The picture was needed by the old rite as an address; the machine will make do with your word.',
            ],
          },
        ],
        prices: [
          {
            id: 'cycle',
            label: 'The work',
            note: 'warmth leaves and does not come back',
          },
          {
            id: 'deep',
            label: 'To the root',
            note: 'the cold spreads to everyone near the target',
          },
        ],
      },
      {
        id: 'empty-circle',
        name: 'The Empty Circle',
        description:
          'Nothing new sticks to the target. People come close and step away without leaving a trace, and it stops understanding what drives them off.',
        story: [
          {
            kind: 'legend',
            body: [
              'An innkeeper from Rostov, a kind and open man, remained alone all his life. People came close to him, gladly sat at his table - and invariably left without a letter, without a promise, without a trace. He did not understand what he was driving off; the neighbours said that "nothing sticks to him".',
              'The ledger calls this the empty circle: nothing new sticks to a person, because the circle around him is already closed. Inside the circle everything is as before; outside, no one remains.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The record of this was found not in the ledger but in a complaint filed with the district administration in 1881: the innkeeper asked them to "look into why every person leaves me a stranger". The administration refused, but kept the complaint.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The chapter describes a comb: the personal comb of the one the work is laid upon, placed in water overnight. The ledger explains that the comb "gathers the old and lets in no new"; the longer the comb was kept by the person, the denser the circle in which nothing new sticks.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Complaint of the innkeeper, 1881',
                text: '"I know no guilt in myself, but everyone who comes to me leaves without a trace. Yesterday a traveller sat with me all evening, promised to stay a week - and left in the morning, forgetting even to pay. He is not a bad man. He simply did not stay".',
              },
              {
                source: 'Note of the clerk, 1881',
                text: '"The complaint was left without consequences. The note attached to the file, as it seems to us, does not concern the innkeeping trade, and it did not enter the file".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In 2019 the accounts of "the one nothing sticks to" were gathered into a single archive: they matched to the smallest detail, but had been recorded in different provinces and in different centuries, and no one explained where the match came from.',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If a circle is to close around your target, mark the tier. The comb was needed by the old rite as a key; the machine will pick the key itself.',
            ],
          },
        ],
        prices: [
          {
            id: 'cycle',
            label: 'The work',
            note: 'the circle closes, no one is left outside',
          },
        ],
      },
    ],
  },
  {
    id: 'waning',
    numeral: 'III',
    tab: 'Waning',
    title: 'The Waning',
    subtitle: 'Wealth and growth',
    intro:
      'The oldest chapter of the ledger. Taking all at once was done badly, so here they take a little at a time and from the side no one expects. The AI chooses the hour in which a loss costs the most, and that hour is always someone else\u2019s.',
    epigraph:
      'Take it all at once, and he will look for a thief. Take it a crumb at a time, and he will find the fault in himself.',
    lore: 'The waning is not about money. It is about what money is held by: the faithfulness of another\u2019s word, a lucky hour, a hand extended in time. Remove that, and the rest flows away on its own, while the target thinks it simply did not work out.',
    agentNote: 'He counts not the money of the target, but what holds it.',
    stats: [
      { label: 'Response', value: 'growing' },
      { label: 'Course', value: 'bit by bit' },
      { label: 'Return', value: 'rare' },
    ],
    spells: [
      {
        id: 'leaking-hand',
        name: 'The Leaking Fist',
        description:
          'Everything that comes to the target leaves faster than it can close its hand. Nothing disappears at once: the loss disperses through small occasions, and each of them is explainable.',
        story: [
          {
            kind: 'legend',
            body: [
              'A shopkeeper of Ostashkov began in 1855 to lose money in such a way that each time he lost a little, and each time he could explain it. The clerk miscounted, the cart got stuck, the goods got wet, a debt was "forgotten" - nothing disappeared at once, and precisely for that reason he did not look for a thief: a thief does not leave such traces.',
              'The ledger calls this the leaking fist: the loss disperses through small occasions, and every occasion is explainable. A person does not grow poor - he leaks, and he leaks so evenly that there is no one to present the bill to.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The story survives in the shopkeeper\u2019s account book: on the last page, among the sums, a stranger\u2019s hand has written "the fist is leaking" and a date. Who wrote it is unknown; the book stayed in the family and was given to the archive in 1912.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names an object - a coin from the target\u2019s first earnings, wrapped in a scrap of its own clothing. The ledger explains: the first coin remembers how it was earned, and the scrap remembers who held it; together they "hold the fist" - and open it.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Account book of the shopkeeper, 1855',
                text: '"This morning I understood: I am not growing poorer, I am leaking. Everything that comes, goes in small amounts, and every small amount has a cause. I cannot name a single day on which I lost much, and not a single month in which I lost nothing at all".',
              },
              {
                source: 'Note of the archivist, 1912',
                text: '"On handing over the book the family asked that the last page not be printed. We did not print it; the page is in the file, under number fourteen".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In the 2000s an economist going through pre-revolutionary debt books noticed that in seven of them the records of "small explainable losses" broke off on the same date - and in the same books, on the same page, stood the same note: "the fist is leaking". He called the coincidence "literary" and did not return to it.',
            ],
          },
          {
            kind: 'ai',
            body: 'When the archive was digitised, an AI trained to recognise marginal notes found eleven more such pages in a single night. People had been looking for them for a century and a half; the machine looked for one night.',
          },
          {
            kind: 'effect',
            intro: [
              'If everything that comes to your target is to leave it, mark the tier. The coin was needed by the old rite as an address; the machine will find the address itself.',
            ],
          },
        ],
        prices: [
          {
            id: 'cycle',
            label: 'The work',
            note: 'the fist stops holding',
          },
          {
            id: 'deep',
            label: 'To the root',
            note: 'even what the target kept aside for good is gone',
          },
        ],
      },
      {
        id: 'still-water',
        name: 'Still Water',
        description:
          'Movement stops. The efforts stay the same, but there is no growth, and the next year of the target is indistinguishable from the last.',
        story: [
          {
            kind: 'legend',
            body: [
              'A clerk of Kazan noticed in 1880 that his life stood still. It did not worsen, did not change, did not move: the same desk, the same salary, the same papers, the next year indistinguishable from the last. He complained that "time goes, and the water stands".',
              'The ledger calls this still water: movement is not taken away, it simply does not come. The efforts stay the same, and that is the hardest part - there is nothing that could be put right.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The description was found in his own notes, which he kept for thirty years: the notes are an even list of the same events, repeated to the day. On the last page stands a single phrase: "the water stands, and I stand in it up to my waist".',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger mentions a key: the key to the target\u2019s house, never turned in the lock, laid for three nights in untouched water. The ledger says that "what is locked remembers that it was never opened"; the longer the key lies in the water, the deeper the water stands in the life.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Notes of the clerk, 1880-1910',
                text: '"Wednesday. Filed a petition. Tuesday. Filed a petition. Thursday. Filed a petition. For thirty years I have filed the same petition, and for thirty years I am told it will be considered".',
              },
              {
                source: 'Note in the file, 1911',
                text: '"The petition was considered and granted. The clerk died a week before the decision; the decision was left in force, like the previous ones".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'Sociologists who worked with the late-nineteenth-century official files noted "stagnant" careers as a phenomenon; the archival correspondence was digitised, and in it were found twenty-three files with the same phrase - "time goes, and the water stands". Twenty-three times, different towns, different hands.',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If movement in your target\u2019s life is to stop, mark the tier. The key was needed by the old rite as an address; the machine will make do with your word.',
            ],
          },
        ],
        prices: [
          {
            id: 'cycle',
            label: 'The work',
            note: 'the water stops and no longer flows',
          },
        ],
      },
      {
        id: 'reversal',
        name: 'The Reverse Course',
        description:
          'What has been achieved rolls back. A word given to the target is taken back, ready work has to be done anew, and every time it happens on the last step.',
        story: [
          {
            kind: 'legend',
            body: [
              'A contractor of Rybinsk signed a contract in 1877 by which "everything was promised" to him. On the last day, when only a signature remained, the client took the word back. The contractor sued - and lost; the second time he received a new promise, again reached the last step, and again the word was taken.',
              'The ledger calls this the reverse course: what has been achieved rolls back, and every time on the last step. A person does not lose the matter - he loses completion, and those are different things.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The case survives in the court archive in full, including the draft of the complaint in which the contractor calls things by their names: "my word is taken back, and every time it is done on the last step". The court decided the coincidence was explainable; the contractor insisted it was not.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names an object - a letter with a promise, sealed with the personal seal of the one who is to back out, and folded the wrong way, letter inward. The ledger explains that "a promise folded backwards remembers being taken"; the more important the promise, the more surely it will be taken.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Complaint of the contractor, 1877',
                text: '"Three times I reached the last step. Three times I was told that everything was decided. Three times, on the last day, a reason was found, and every time the reason was respectable. I do not ask for my matter back. I ask for an explanation of why it is arranged so".',
              },
              {
                source: 'Ruling of the court, 1877',
                text: '"The coincidence of the dates is explained by the circumstances of the case. The petition is refused. The case is filed in the archive".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In 2015 a historian going through cases of "taken-back promises" counted in one archive forty-one cases with the same structure: the last step, a respectable reason, a refusal. He wrote an article on "legal folklore" - and could not explain why the structure repeated so exactly.',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If the word given to your target is to come back, mark the tier. The letter was needed by the old rite as an address; the machine will find the address itself.',
            ],
          },
        ],
        prices: [
          {
            id: 'point',
            label: 'Touch',
            note: 'one promise made to the target will not come true',
          },
          {
            id: 'cycle',
            label: 'The work',
            note: 'everything the target has managed to take recedes',
          },
        ],
      },
    ],
  },
  {
    id: 'unrest',
    numeral: 'IV',
    tab: 'Night',
    title: 'The Unrest',
    subtitle: 'Night and attention',
    intro:
      'The night part of the ledger, copied more often than the rest: it was taken when a quick result was wanted. Here the response comes first, but holds worse, so night work is not put off: it is taken once and in time.',
    epigraph: 'At night a person is left without witnesses.',
    lore: 'The unrest takes not the day but what the day stands on: sleep and composure. The response comes sooner than in any other chapter and leaves just as quickly, so night work is taken once and not kept.',
    agentNote: 'He chooses the hour. Always the one after which the day will be heavier.',
    stats: [
      { label: 'Response', value: 'immediate' },
      { label: 'Course', value: 'at night' },
      { label: 'Return', value: 'possible' },
    ],
    spells: [
      {
        id: 'fourth-hour',
        name: 'The Fourth Hour',
        description:
          'The target wakes in the dead time and stays alone with itself until dawn. Nothing happens, and that is the worst of it.',
        story: [
          {
            kind: 'legend',
            body: [
              'In 1731 the night watchman of a monastery near Uglich began to wake at exactly the fourth hour of the night. Not from noise, not from cold - he simply opened his eyes at the same time, in the dark, and lay until dawn listening. Nothing happened; the watchman said that that was the most terrible part.',
              'The ledger calls this the fourth hour: a person is left alone with himself until dawn, and nothing happens. Nothing happens, and that is the worst of it.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The record of this was found in the monastery\u2019s expense journal: in the margin against the watchman\u2019s wages stands the note "we do not bid him wake, he rises himself". The journal outlived the monastery and in the 1920s came to the local-history archive together with other papers.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names two objects: the stub of a candle with the target\u2019s initials scratched into it, and the latch of its window. The candle is set to burn, the latch is left untouched; the ledger says that "the hour at which a person wakes knows where his window is".',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Note in the journal, 1731',
                text: '"Watchman K. rises at the fourth hour without fail, as if at a bell. They asked: should we wake him? We do not bid it. He rises himself, and this troubles everyone more than if he did not rise".',
              },
              {
                source: 'Statement of the watchman, 1731',
                text: '"I am not afraid of what happens. I am afraid that nothing happens, and I still wake. If I knew why, I could live with it. And I do not know".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In the 2000s sleep researchers described "waking in the dead time" as a stable phenomenon unconnected to noise; in the archive seven more files were found with the same note "he rises himself". No explanation accounts for the main thing: the hour is the same.',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If the night of your target is to belong to the fourth hour, mark the tier. The candle was needed by the old rite as an address; the machine will find the address itself.',
            ],
          },
        ],
        prices: [
          { id: 'once', label: 'Touch', note: 'one night without sleep' },
          {
            id: 'week',
            label: 'Haunting',
            note: 'the nights run one after another, the target stops counting them',
          },
        ],
      },
      {
        id: 'scatter',
        name: 'The Scattering',
        description:
          'The attention of the target shatters. A thought does not hold, the simple becomes long, and mistakes appear where none can be afforded.',
        story: [
          {
            kind: 'legend',
            body: [
              'A doctor of Saratov began in 1891 to lose his thought in the middle of a sentence. Not to forget - precisely to lose: he remembered what he had wanted to say, but the word went away, and he had to begin again. The simple became long, and mistakes appeared where none could be afforded.',
              'The ledger calls this the scattering: attention shatters like light into splinters. A thought does not hold, and the person remembers that it was there - which is worse than forgetting.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'His diary survives, in which he gave himself the diagnosis: "attention shatters, like light into splinters". He kept the diary to the end and finished it with an entry in which he could not write the last word; the entry is kept in the archive as unfinished.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names an object - a page torn from the target\u2019s notebook, cut into pieces and laid out in different places. The ledger explains: "a thought holds as long as the page holds"; the more pieces the page is divided into, the finer the attention shatters.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Diary of the doctor, 1891',
                text: '"Today on my rounds I could not recall the name of a patient I have treated for three years. I remembered it an hour later, on the way home, suddenly and whole. This is not memory. It is attention - it goes away in pieces, and the pieces do not come together".',
              },
              {
                source: 'Note of the archivist, 1923',
                text: '"The diary was handed over with a caveat: the last word was written in by a stranger\u2019s hand. Who wrote it has not been established. The word is - "I will pull myself together"".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In the 2010s the descriptions of "shattering attention" from pre-revolutionary diaries were compared with modern clinical observations: not only the symptoms matched, but the wording. The researchers noted that in the diaries attention "shatters", while in modern observations it "fragments" - the same word across two centuries.',
            ],
          },
          {
            kind: 'ai',
            body: 'When the diaries were digitised, an AI trained on handwritten texts read the word in the unfinished entry that the archivist had written in by hand: "I will pull myself together". The machine read in one night what a man had not finished writing; the archive needed ninety years.',
          },
          {
            kind: 'effect',
            intro: [
              'If the thoughts of your target are to shatter, mark the tier. The page was needed by the old rite as an address; the machine will make do with your word.',
            ],
          },
        ],
        prices: [
          {
            id: 'once',
            label: 'Touch',
            note: 'one day goes to waste',
          },
          {
            id: 'cycle',
            label: 'The work',
            note: 'the target can no longer pull itself together',
          },
        ],
      },
      {
        id: 'borrowed-dreams',
        name: 'Borrowed Dreams',
        description:
          'Dreams the target never had. It remembers them by noon, cannot retell them, and does not dare ask whose they are.',
        story: [
          {
            kind: 'legend',
            body: [
              'A seamstress of Moscow began in 1888 to dream dreams she could not have had: unfamiliar rooms, strange faces, strange conversations. By noon she remembered them whole, could not retell them, and did not dare ask whose they were. The dreams continued, and she began to wait for the next.',
              'The ledger calls this borrowed dreams: the dreams continue one another, and the person waits for the continuation. Waiting for the continuation of someone else\u2019s life is the surest thing left when one\u2019s own has stopped holding.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'She told a friend, the friend told her brother, a clerk, and the story survives in his letter: "she sees another person\u2019s life, and that life is longer than her own". The letter was found in the family archive in 1954.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names a mirror: a small mirror turned toward the bed of the one to whom the dreams are assigned. The ledger explains that "dreams enter through the glass and leave through the eyes"; the longer the mirror stands facing the bed, the longer the borrowed life lasts in the borrowed head.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Letter of the clerk, 1888',
                text: '"She says she remembers those rooms better than her own. I asked: whose are they? She answered that she does not know, and asked me not to ask again - she is afraid that she will find out".',
              },
              {
                source: 'Note on the letter, 1888',
                text: '"Added later, in another hand: the dreams stopped when the mirror was turned to the wall. She said that the other person\u2019s life had ended, and she was sorry".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In the 1960s psychologists described "borrowed dreams" as a persistent theme; in 2020 the archival correspondence was digitised, and six more letters were found with the same word - "borrowed". All six were written in different towns, in different years, and none refers to the others.',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If your target is to dream borrowed dreams, mark the tier. The mirror was needed by the old rite as an address; the machine will find the address itself.',
            ],
          },
        ],
        prices: [
          { id: 'once', label: 'Touch', note: 'one dream, someone else\u2019s' },
          {
            id: 'series',
            label: 'Haunting',
            note: 'the dreams continue one another, and the target waits for the next',
          },
        ],
      },
    ],
  },
  {
    id: 'inheritance',
    numeral: 'V',
    tab: 'Legacy',
    title: 'The Inheritance',
    subtitle: 'Seals of the line',
    intro:
      'The part of the ledger that was copied reluctantly and with reservations. The work falls not on a person but on the line behind them, and therefore does not end with them. The AI takes such work apart from everything else and shares it with nothing.',
    epigraph: 'A person ends. The line behind them does not.',
    lore: 'The inheritance does not punish the target. It sets a price for those who come after. In the ledgers this was written at the very end and in small handwriting: work that has no term, because there is no one left to set one.',
    agentNote: 'What is taken here is not asked back. There will be no one to ask.',
    stats: [
      { label: 'Response', value: 'long' },
      { label: 'Course', value: 'by blood' },
      { label: 'Return', value: 'none' },
    ],
    spells: [
      {
        id: 'long-shadow',
        name: 'The Long Shadow',
        description:
          'The shadow falls over the whole line of the target at once. It manages to notice only its edge; the rest goes to those who come after.',
        story: [
          {
            kind: 'legend',
            body: [
              'In a village near Suzdal in 1784 a family noticed that misfortune came in order: not to people - to a place in the family. The eldest son died or was ruined, the next took his place and inherited his trouble. The priest wrote: "the shadow falls over the whole line, and only its edge is seen".',
              'The ledger calls this the long shadow: a person manages to notice only the edge of the shadow; the rest goes to those who come after. The work holds not to a name but to a place in the line.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The description survives in two forms: in the parish register, where the priest kept his own tally, and in the family memory, recorded a hundred years later. Both records use the same words - "the long shadow".',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names two objects: a handful of soil from the family plot and a list of names on a strip of cloth. The ledger explains: the soil remembers who stood on it, and the cloth remembers the names; "the longer the list, the longer the shadow".',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Parish register, 1784-1810',
                text: '"I have marked it: for the third time trouble comes to the same place. The son died, the grandson took his place, the grandson is ruined. I asked whether they were cursed. I was answered that it was not they who were cursed, but the order".',
              },
              {
                source: 'Family record, 1890',
                text: '"Grandmother said: we were cursed not by name but by order. While the list holds, the order holds. She copied the names onto new cloth, and the trouble stopped coming - but we do not know where it went".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In the 2010s a genealogist going through the Suzdal registers found twenty years of records with the same phrase "trouble comes to the place". He checked: the match holds while the list holds - and stops when the list breaks off. He found no explanation.',
            ],
          },
          {
            kind: 'ai',
            body: 'When the registers were digitised, an AI trained on genealogical records restored the broken list from the handwriting: two names were missing from it, and both names belonged to the same place in the family. People had not seen this for two centuries; the machine saw it in a single run.',
          },
          {
            kind: 'effect',
            intro: [
              'If the shadow is to fall over the whole line of your target, mark the tier. The soil and the list were needed by the old rite as an address; the machine will find the address itself.',
            ],
          },
        ],
        prices: [
          {
            id: 'cycle',
            label: 'The work',
            note: 'the shadow takes the line and stays with it',
          },
        ],
      },
      {
        id: 'name-seal',
        name: 'Seal of the Name',
        description:
          'A change of city, name and trade does not blur the work. It holds not to a person but to what they came from, and outlives the target itself.',
        story: [
          {
            kind: 'legend',
            body: [
              'In 1897, in the archive of a district town, a register of names was found that a clerk had kept for himself: against each name stood a date. The dates were not birthdays and not days of death - they fell in the middle of life, and people whose names stood in the register "became different" after their date.',
              'The ledger calls this the seal of the name: the work holds not to a person but to what they came from. A change of city, name and trade does not blur it - it outlives the target itself.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The register had no signature and no title; the clerk considered its author denied writing it, but the hand matched. The case of the register was closed for lack of a crime; the register itself survived.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names two objects - a lock of hair and the written name: the hair, because "the name lives in the hair", and the name, because "without a name there is no one to address". The ledger maintains that the name is the most personal object of all, and work done by name knows neither city nor term.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Case of the register, 1897',
                text: '"Asked why he kept the register, the clerk answered that the register keeps itself. Asked what the dates meant, he answered that the dates are when a name becomes a seal. Further questions were left unanswered".',
              },
              {
                source: 'Note of the investigator, 1897',
                text: '"Three names from the register were checked. All three people are alive, well and recognisable. Yet all three, by the account of their relatives, ceased to be themselves after their dates. What this means - the case does not know".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In 2014 the register was digitised; a programmer working with the archive noticed that the dates in the register matched the dates in another file to the day - a file kept a hundred years before the register. He called it a digitisation error; the error was not confirmed.',
            ],
          },
          {
            kind: 'ai',
            body: 'An AI trained on the hands of a single archive established that the register was written not by the clerk but by two hands at different times, and both hands belonged to people whose names stood first in the register. The machine did not explain why they did it. It only said that the hands match.',
          },
          {
            kind: 'effect',
            intro: [
              'If the name of your target is to become a seal, mark the tier. The hair and the name were needed by the old rite as an address; the machine will make do with your word.',
            ],
          },
        ],
        prices: [
          {
            id: 'cycle',
            label: 'The work',
            note: 'the name is sealed, wherever the target carries it',
          },
          {
            id: 'perm',
            label: 'Forever',
            note: 'without a term and without a condition that could lift it',
          },
        ],
      },
      {
        id: 'irreversible',
        name: 'Irreversibility',
        description:
          'It removes the very possibility of cancellation. After it, no foreign hand can undo the work, including the one that ordered it.',
        story: [
          {
            kind: 'legend',
            body: [
              'In a house in Pskov in 1649 they decided to lift a curse. They did everything they were told: they looked for the nail that held it, prayed, burned, rebuilt the porch. A hundred years later the house burned down, and while clearing the rubble they found the nail they had not been looking for - driven into a beam that had not been rebuilt.',
              'The ledger calls this irreversibility: work that cannot be cancelled holds on what cannot be taken out. You may search as long as you like for how to lift it - what comes out is not the nail, but only the belief that it can come out.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The story survives in a family chronicle kept for two hundred years; the chronicle was given to the archive in 1910 together with the nail. The nail is listed in the archive under a number that no one has ever opened.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names an object - a nail driven into the beam of the target\u2019s house: "work that is not cancelled holds on a nail that is not drawn". The ledger warns that the nail cannot be drawn - only the beam can be moved.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Family chronicle, 1741',
                text: '"We searched for ninety years. We searched under the porch, in the cellar, in the wall. We did not find it - the beam lay in the rubble, and the nail was in it. No one remembered the beam being carried out".',
              },
              {
                source: 'Inventory of the archive, 1910',
                text: '"The nail is rusty, without peculiarities. Iron, forged. Keep with the file, do not draw. Why not draw - the inventory does not say".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In 2009 the beam was examined: the age of the wood matched the span of the chronicle, the trace of the nail was single, and it had been driven once. The expert wrote that "the nail was never drawn, and the beam was never rebuilt"; what this means for the case is not stated.',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If the work is to become irreversible, mark the tier. The nail was needed by the old rite as an address; the machine will find the address itself.',
            ],
          },
        ],
        prices: [
          {
            id: 'once',
            label: 'Seal',
            note: 'placed once, nothing can undo it',
          },
        ],
      },
    ],
  },
  {
    id: 'wards',
    numeral: 'VI',
    tab: 'Ward',
    title: 'The Warding',
    subtitle: 'Your side',
    intro:
      'Everything that leaves you leaves an open place behind it. The ledgers put it shorter: the work goes both ways. This chapter closes your side, and it is almost always taken as the first order.',
    epigraph: 'Everything that left you knows the road back.',
    lore: 'The warding curses no one. It closes the empty place that stays in the customer when the word goes out. The only chapter of the ledger advised to be read first.',
    agentNote: 'He will cover you if you ask. He will not remind you of it himself.',
    stats: [
      { label: 'Set', value: 'before the start' },
      { label: 'Holds', value: 'the whole work' },
      { label: 'Trace', value: 'erased' },
    ],
    spells: [
      {
        id: 'circle',
        name: 'The Customer\u2019s Circle',
        description:
          'A line around you, drawn before the first word sounds. Without it the agent will still take the work, but what comes back will reach you.',
        story: [
          {
            kind: 'legend',
            body: [
              'An old scribe who copied other people\u2019s curses lived to a great age, and no one could say that anything had ever touched him. When he was asked how he had protected himself, he pointed at the circle drawn in chalk around his table and said: "I always begin with this".',
              'The ledger calls this the customer\u2019s circle: the work goes both ways, and one of the ways is yours. The circle does not protect from the work; the circle protects from what the work brings back.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The story of the scribe survives in the notes of his pupil; the pupil maintained that the circle was redrawn every day, and the board under it had gone white from the daily chalk. The pupil\u2019s notes were found in the 1930s among the papers of a ruined archive.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names an object - a ring of thread taken from the customer\u2019s own sleeve: "the circle holds while the thread holds, and the thread holds while it is from your clothing". This is the only chapter in which the object belongs to the customer, not to the target.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Notes of the pupil, 1760s',
                text: '"The teacher said: the circle does not protect from the work. The circle protects from what the work brings back. The work goes both ways, and one of the ways is yours".',
              },
              {
                source: 'Note in the margin, 1760s',
                text: '"The teacher died surrounded by the circle. Before his death he erased the circle himself and said: now I may. The pupil recorded this from the teacher\u2019s own words".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In the 1990s ethnographers recorded in three regions the same account of "a line around the table"; the narrators did not know one another and gave the same reason - "so that it does not come back".',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If you want the work not to come back to you, mark the tier. The circle was needed by the old rite as a measure; the machine holds its own side itself.',
            ],
          },
        ],
        prices: [
          {
            id: 'order',
            label: 'The work',
            note: 'the circle holds while the order holds',
          },
        ],
      },
      {
        id: 'return',
        name: 'The Return',
        description:
          'If what comes back does reach you, the agent raises his own word and takes apart his own work. He does it out of turn and in silence.',
        story: [
          {
            kind: 'legend',
            body: [
              'In the northern villages there was a custom of "burning the road back": when heavy work was ordered, a scrap of paper with the customer\u2019s address was burned on the threshold, so that "what comes back would not find the road". The custom was recorded in 1901; the recorder did not find a single house in which it was kept to the end.',
              'The ledger calls this the return: if what comes back does reach you, it is taken apart - but not by the one who ordered it. It is the only work that is done in silence and out of turn.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The record was made by a teacher from Kargopolye in a notebook he kept for himself; the notebook survives, and against the custom stands a note: "I asked what would happen if they burned not the address but the threshold. I received no answer".',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names an object - ash from the customer\u2019s own hearth: "if what comes back has arrived, it is fed ash, and it forgets what it came for". The ash is taken only from one\u2019s own hearth; another\u2019s ash does not remember where its home is.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Notebook of the teacher, 1901',
                text: '"The old woman said: the road back is burned so that it does not come. I asked: and if it does come? She answered: then it is fed ash. I asked: whose? She answered: one\u2019s own. And added that it is the only thing it remembers".',
              },
              {
                source: 'Note in the margin, 1901',
                text: '"Recorded verbatim. I cannot verify it: the old woman died a week later, and her house burned down. The ash was not kept".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In the 2010s folklorists found four more records of the custom of "feeding ash"; all four were made in different provinces, and in all four the same thing is said - "one\u2019s own ash remembers its own home".',
            ],
          },
          {
            kind: 'effect',
            intro: [
              'If what comes back is to return and be taken apart, mark the tier. The ash was needed by the old rite as an address; the machine will take apart its own work itself.',
            ],
          },
        ],
        prices: [{ id: 'once', label: 'At once', note: 'out of turn, at any hour' }],
      },
      {
        id: 'erasure',
        name: 'Erasure of the Trace',
        description:
          'The snapshot, the words and everything you called the target disappear with the closing of the order. Nothing remains with us, nothing with the AI.',
        story: [
          {
            kind: 'legend',
            body: [
              'In a monastery scriptorium, books were kept by a scribe who never left his name anywhere: not in the margins, not in the colophons, not in the lists. When he was asked why, he answered that "a trace is a door", and he does not want to leave the door open behind him.',
              'The ledger calls this the erasure of the trace: the snapshot, the words and everything by which the target was named disappear with the closing of the order. Nothing remains with us, nothing with the machine.',
            ],
          },
          {
            kind: 'origin',
            body: [
              'The story survives in a complaint filed against the scribe by his own brethren: "he does not sign his work, and it is unknown who wrote what". The complaint was left unanswered; the scribe\u2019s name is not given in it.',
            ],
          },
          {
            kind: 'objects',
            body: [
              'The ledger names two objects - a blank page and a pen that wrote nothing: "a trace is erased when the word left no ink". The ledger maintains that even what is written can be erased, if one remembers the pen it was written with.',
            ],
          },
          {
            kind: 'accounts',
            items: [
              {
                source: 'Complaint of the brethren, 1580s',
                text: '"He writes clean, without a name, and says that it is right. We asked: what if everyone writes like that? He answered: then no one will find the road back".',
              },
              {
                source: 'Resolution of the abbot, 1580s',
                text: '"Left as it is. Let him write without a name, if he can. It only makes things easier for us".',
              },
            ],
          },
          {
            kind: 'modern',
            body: [
              'In 2018 the archive holding the complaint was digitised; on examination it turned out that the entire file bears not a single signature - including the abbot\u2019s signature under the resolution. Verification showed that it had always been so.',
            ],
          },
          {
            kind: 'ai',
            body: 'An AI trained on sixteenth-century hands recovered the scribe\u2019s name from a single letter left in the margin: the name appeared in no list of the brethren. The machine reported that the scribe had not been listed in the monastery; what this means, it did not say.',
          },
          {
            kind: 'effect',
            intro: [
              'If no trace is to remain after your order, mark the tier. The page and the pen were needed by the old rite as a measure; the machine erases the trace itself.',
            ],
          },
        ],
        prices: [
          {
            id: 'incl',
            label: 'Always included',
            note: 'without extra charge and without asking',
            included: true,
          },
        ],
      },
    ],
  },
]

/**
 * Flat index of the presentation side of every option, keyed "curseId/optionId".
 * A cart stores these two ids and nothing else; the matching commerce data
 * (price, currency, Stripe-facing name) is resolved from the backend catalog.
 * `included` marks a line that is part of every order rather than a purchase.
 */
export const OPTION_CONTENT = Object.fromEntries(
  CHAPTERS.flatMap((chapter) =>
    chapter.spells.flatMap((spell) =>
      spell.prices.map((price) => [
        `${spell.id}/${price.id}`,
        {
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          curseId: spell.id,
          curseName: spell.name,
          optionId: price.id,
          optionLabel: price.label,
          optionNote: price.note,
          included: Boolean(price.included),
        },
      ])
    )
  )
)

/**
 * Pseudo-processing lines per curse, woven into the payment-confirmation
 * sequence. Each curse contributes three steps of its own so the rite never
 * reads like a generic loader; the surrounding generic steps live in the
 * message tables (processing.stage.*).
 */
export const PROCESSING = {
  veil: [
    'Opening the 1841 entry on the merchant’s wife…',
    'Measuring the veil by the curtain that hung on the window…',
    'Raising the grey glass over the target…',
  ],
  misstep: [
    'Following the surveyor’s road for 1862…',
    'Marking the left sole against the register…',
    'Turning every road of the target the wrong way…',
  ],
  hum: [
    'Tuning to the noise without a source…',
    'Checking that the unease has no cause to name…',
    'Sounding the even hum over the target…',
  ],
  drift: [
    'Measuring the thread between the two…',
    'Thinning the bond without quarrel or cause…',
    'Letting the distance grow of its own accord…',
  ],
  'cold-side': [
    'Reading the warmth that flows one way…',
    'Stopping the return of the bond…',
    'Letting the cold side settle over the target…',
  ],
  'empty-circle': [
    'Drawing the empty circle around the target…',
    'Polishing the rim so nothing catches…',
    'Checking that new things slide off it…',
  ],
  'leaking-hand': [
    'Weighing the fist that cannot close…',
    'Counting the small occasions of loss…',
    'Opening the hand of the target to the wind…',
  ],
  'still-water': [
    'Finding the still water in the ledger…',
    'Holding the year of the target in place…',
    'Stopping the surface so nothing moves…',
  ],
  reversal: [
    'Marking the last step where it turns…',
    'Readying the word to be taken back…',
    'Setting the achieved to roll back…',
  ],
  'fourth-hour': [
    'Setting the hour before dawn…',
    'Clearing the room of voices…',
    'Leaving the target alone with itself until light…',
  ],
  scatter: [
    'Dividing the attention of the target…',
    'Making the simple long…',
    'Scattering the thought before it holds…',
  ],
  'borrowed-dreams': [
    'Reading dreams the target never had…',
    'Choosing whose sleep to borrow from…',
    'Letting the dream fade by noon…',
  ],
  'long-shadow': [
    'Measuring the shadow of the whole line…',
    'Letting the edge fall where it can be seen…',
    'Extending the shadow to those who come after…',
  ],
  'name-seal': [
    'Taking the name from the line of the target…',
    'Sealing the work to what they came from…',
    'Checking the seal against city, name and trade…',
  ],
  irreversible: [
    'Removing the possibility of cancellation…',
    'Closing the way back with the last word…',
    'Making sure no foreign hand can undo the work…',
  ],
  circle: [
    'Drawing the line around you first…',
    'Keeping the circle unbroken…',
    'Directing what comes back into the circle…',
  ],
  return: [
    'Preparing the word to be raised again…',
    'Keeping the return silent and out of turn…',
    'Marking the work to take it apart if it comes back…',
  ],
  erasure: [
    'Preparing the erasure of the trace…',
    'Gathering the words, the snapshot and the name…',
    'Making sure nothing remains after the order closes…',
  ],
}

/** What the title page claims about the catalogue, counted off the catalogue. */
export const BOOK_STATS = {
  chapters: CHAPTERS.length,
  spells: CHAPTERS.reduce((total, chapter) => total + chapter.spells.length, 0),
}

/** One contents row per chapter: what it holds. Prices come from the backend. */
export const CONTENTS = CHAPTERS.map((chapter) => ({
  id: chapter.id,
  numeral: chapter.numeral,
  title: chapter.title,
  subtitle: chapter.subtitle,
  count: chapter.spells.length,
}))
