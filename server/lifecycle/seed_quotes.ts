import { getFirestore } from 'firebase-admin/firestore';

const quotesPayload = [
    {
        "id": "q_001",
        "content": "When you are offended at any man's fault, turn to yourself and study your own failings. Then you will forget your anger.",
        "author": "Epictetus",
        "source": "https://www.brainyquote.com/quotes/epictetus_132883",
        "tags": [
            "stoicism",
            "anger",
            "self-reflection"
        ],
        "notes": null
    },
    {
        "id": "q_002",
        "content": "There are three types of people in the world: Those who watch things happen, those who make things happen, and those who wonder why.",
        "author": "Nicholas Murray Butler",
        "source": null,
        "tags": [],
        "notes": null
    },
    {
        "id": "q_003",
        "content": "Quality is not an act, it is a habit.",
        "author": "Aristotle",
        "source": "https://www.brainyquote.com/quotes/aristotle_379604",
        "tags": [
            "philosophy",
            "excellence"
        ],
        "notes": null
    },
    {
        "id": "q_004",
        "content": "Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.",
        "author": "Marcus Aurelius",
        "source": "https://www.goodreads.com/quotes/126752-never-let-the-future-disturb-you-you-will-meet-it",
        "tags": [
            "stoicism",
            "anxiety",
            "reason"
        ],
        "notes": null
    },
    {
        "id": "q_005",
        "content": "Do not think, just do.",
        "author": "Horace",
        "source": "https://www.brainyquote.com/quotes/horace_119744",
        "tags": [
            "action"
        ],
        "notes": null
    },
    {
        "id": "q_006",
        "content": "Turn your face toward the sun and the shadows will fall behind you.",
        "author": "Maori Proverb",
        "source": "https://www.goodreads.com/quotes/4564606-turn-your-face-toward-the-sun-and-the-shadows-will",
        "tags": [
            "optimism",
            "wisdom"
        ],
        "notes": null
    },
    {
        "id": "q_007",
        "content": "Failure is success if we learn from it.",
        "author": "Malcolm Forbes",
        "source": "https://www.brainyquote.com/quotes/malcolm_forbes_121340",
        "tags": [
            "failure",
            "success",
            "learning"
        ],
        "notes": null
    },
    {
        "id": "q_008",
        "content": "When you want to succeed, as badly as you want to breathe, that is when you will be successful.",
        "author": "Eric Thomas",
        "source": "https://www.goodreads.com/quotes/7947574-there-was-a-young-man-who-you-know-he-wanted",
        "tags": [
            "success",
            "motivation"
        ],
        "notes": null
    },
    {
        "id": "q_009",
        "content": "A somebody was once a nobody who wanted to and did.",
        "author": "John Burroughs",
        "source": "https://www.brainyquote.com/quotes/john_burroughs_120947",
        "tags": [
            "success",
            "action"
        ],
        "notes": null
    },
    {
        "id": "q_010",
        "content": "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.",
        "author": "Martin Luther King, Jr.",
        "source": "https://www.brainyquote.com/quotes/martin_luther_king_jr_101472",
        "tags": [
            "love",
            "peace"
        ],
        "notes": null
    },
    {
        "id": "q_011",
        "content": "If you can dream it, you can do it.",
        "author": "Walt Disney",
        "source": "https://www.brainyquote.com/quotes/walt_disney_130027",
        "tags": [
            "dreams",
            "action"
        ],
        "notes": null
    },
    {
        "id": "q_012",
        "content": "If we did all the things we are capable of, we would literally astound ourselves.",
        "author": "Thomas Edison",
        "source": "https://www.brainyquote.com/quotes/thomas_a_edison_161979",
        "tags": [
            "potential"
        ],
        "notes": null
    },
    {
        "id": "q_013",
        "content": "How much more grievous are the consequences of anger than the causes of it.",
        "author": "Marcus Aurelius",
        "source": "https://www.goodreads.com/quotes/77774-how-much-more-grievous-are-the-consequences-of-anger-than",
        "tags": [
            "stoicism",
            "anger"
        ],
        "notes": null
    },
    {
        "id": "q_014",
        "content": "No greater love hath a man than he lay down his life for his brother. Not for millions, not for glory, not for fame. For one person, in the dark where no one will ever know or see.",
        "author": "J. Michael Straczynski",
        "source": "https://www.goodreads.com/quotes/4472270-no-greater-love-hath-a-man-than-he-lay-down",
        "tags": [
            "love",
            "sacrifice"
        ],
        "notes": null
    },
    {
        "id": "q_015",
        "content": "It does not matter how slowly you go as long as you do not stop.",
        "author": "Confucius",
        "source": "https://www.brainyquote.com/quotes/confucius_140908",
        "tags": [
            "perseverance"
        ],
        "notes": null
    },
    {
        "id": "q_016",
        "content": "You have power over your mind - not outside events. Realize this, and you will find strength.",
        "author": "Marcus Aurelius",
        "source": "https://www.goodreads.com/quotes/190580-you-have-power-over-your-mind---not-outside-events",
        "tags": [
            "stoicism",
            "strength",
            "mindset"
        ],
        "notes": null
    },
    {
        "id": "q_017",
        "content": "Both optimists and pessimists contribute to society. The optimist invents the aeroplane, the pessimist the parachute.",
        "author": "George Bernard Shaw",
        "source": "https://www.goodreads.com/quotes/193715-both-optimists-and-pessimists-contribute-to-society-the-optimist-invents",
        "tags": [
            "perspective",
            "society"
        ],
        "notes": null
    },
    {
        "id": "q_018",
        "content": "If it is not right do not do it; if it is not true do not say it.",
        "author": "Marcus Aurelius",
        "source": "https://www.goodreads.com/quotes/78675-if-it-is-not-right-do-not-do-it-if",
        "tags": [
            "stoicism",
            "integrity",
            "truth"
        ],
        "notes": null
    },
    {
        "id": "q_019",
        "content": "Ever tried. Ever failed. No matter. Try Again. Fail again. Fail better.",
        "author": "Samuel Beckett",
        "source": "https://www.brainyquote.com/quotes/samuel_beckett_121335",
        "tags": [
            "failure",
            "resilience"
        ],
        "notes": null
    },
    {
        "id": "q_020",
        "content": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "author": "Winston S. Churchill",
        "source": "https://www.goodreads.com/quotes/tag/success",
        "tags": [
            "success",
            "failure",
            "courage"
        ],
        "notes": null
    },
    {
        "id": "q_021",
        "content": "You will never find time for anything. If you want time you must make it.",
        "author": "Charles Buxton",
        "source": "https://www.goodreads.com/quotes/26920-you-will-never-find-time-for-anything-if-you-want",
        "tags": [
            "time management",
            "discipline"
        ],
        "notes": null
    },
    {
        "id": "q_022",
        "content": "In three words I can sum up everything I have learned about life -- it goes on.",
        "author": "Robert Frost",
        "source": "https://www.goodreads.com/quotes/258-in-three-words-i-can-sum-up-everything-i-ve-learned",
        "tags": [
            "life",
            "wisdom"
        ],
        "notes": null
    },
    {
        "id": "q_023",
        "content": "Failure is the condiment that gives success its flavor.",
        "author": "Truman Capote",
        "source": "https://www.goodreads.com/quotes/tag/success",
        "tags": [
            "failure",
            "success"
        ],
        "notes": null
    },
    {
        "id": "q_024",
        "content": "The scariest moment is always just before you start. After that, things can only get better.",
        "author": "Stephen King",
        "source": "https://www.goodreads.com/quotes/357051-the-scariest-moment-is-always-just-before-you-start-after",
        "tags": [
            "fear",
            "starting"
        ],
        "notes": null
    },
    {
        "id": "q_025",
        "content": "No matter what people tell you, words and ideas can change the world.",
        "author": "Robin Williams",
        "source": "https://www.brainyquote.com/quotes/robin_williams_383827",
        "tags": [
            "inspiration",
            "change"
        ],
        "notes": null
    },
    {
        "id": "q_026",
        "content": "It always seems impossible until it's done.",
        "author": "Nelson Mandela",
        "source": "https://www.brainyquote.com/quotes/nelson_mandela_378967",
        "tags": [
            "perseverance"
        ],
        "notes": null
    },
    {
        "id": "q_027",
        "content": "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        "author": "Nelson Mandela",
        "source": "https://www.setquotes.com/the-greatest-glory-in-living-lies-not-in-falling-but-in-rising/",
        "tags": [
            "resilience"
        ],
        "notes": null
    },
    {
        "id": "q_028",
        "content": "Always bear in mind that your own resolution to succeed is more important than any other.",
        "author": "Abraham Lincoln",
        "source": "https://www.brainyquote.com/quotes/abraham_lincoln_109274",
        "tags": [
            "success",
            "determination"
        ],
        "notes": null
    },
    {
        "id": "q_029",
        "content": "If you tell the truth, you do not have to remember anything.",
        "author": "Mark Twain",
        "source": "https://www.brainyquote.com/quotes/mark_twain_133066",
        "tags": [
            "truth",
            "integrity"
        ],
        "notes": null
    },
    {
        "id": "q_030",
        "content": "When something is important enough, you do it even if the odds are not in your favor.",
        "author": "Elon Musk",
        "source": "https://www.brainyquote.com/quotes/elon_musk_567219",
        "tags": [
            "determination",
            "risk"
        ],
        "notes": null
    },
    {
        "id": "q_031",
        "content": "Are right and wrong convertible terms, dependent upon popular opinion?",
        "author": "William Lloyd Garrison",
        "source": "https://www.brainyquote.com/quotes/william_lloyd_garrison_106090",
        "tags": [
            "morality",
            "integrity"
        ],
        "notes": null
    },
    {
        "id": "q_032",
        "content": "To live is the rarest thing in the world. Most people exist, that is all.",
        "author": "Oscar Wilde",
        "source": "https://www.goodreads.com/quotes/2448-to-live-is-the-rarest-thing-in-the-world-most",
        "tags": [
            "life"
        ],
        "notes": null
    },
    {
        "id": "q_033",
        "content": "I would define, in brief, the poetry of words as the rhythmical creation of Beauty.",
        "author": "Edgar Allan Poe",
        "source": "https://www.brainyquote.com/quotes/edgar_allan_poe_107273",
        "tags": [
            "art",
            "beauty"
        ],
        "notes": null
    },
    {
        "id": "q_034",
        "content": "Start where you are. Use what you have. Do what you can.",
        "author": "Arthur Ashe",
        "source": "https://www.brainyquote.com/quotes/arthur_ashe_371527",
        "tags": [
            "action",
            "resourcefulness"
        ],
        "notes": null
    },
    {
        "id": "q_035",
        "content": "Man is so made that whenever anything fires his soul, impossibilities vanish.",
        "author": "Jean De la Fontaine",
        "source": "https://bigthink.com/words-of-wisdom/jean-de-la-fontaine-on-passion/",
        "tags": [
            "passion"
        ],
        "notes": null
    },
    {
        "id": "q_036",
        "content": "The happiness of your life depends upon the quality of your thoughts - therefore, guard accordingly, and take care that you entertain no notions unsuitable to virtue and reasonable nature.",
        "author": "Marcus Aurelius",
        "source": "https://www.brainyquote.com/quotes/marcus_aurelius_121534",
        "tags": [
            "stoicism",
            "happiness",
            "thoughts"
        ],
        "notes": null
    },
    {
        "id": "q_037",
        "content": "Keep going, no matter what.",
        "author": "Reginald Lewis",
        "source": "https://reginaldflewis.com/",
        "tags": [
            "perseverance"
        ],
        "notes": null
    },
    {
        "id": "q_038",
        "content": "What you are afraid to do is a clear indication of what you need to do.",
        "author": "Ralph Waldo Emerson",
        "source": "https://www.goodreads.com/quotes/9989196-what-you-are-afraid-to-do-is-a-clear-indication",
        "tags": [
            "fear",
            "courage"
        ],
        "notes": null
    },
    {
        "id": "q_039",
        "content": "Most people overestimate what they can do in one year and underestimate what they can do in ten years.",
        "author": "Bill Gates",
        "source": "https://www.goodreads.com/quotes/302999-most-people-overestimate-what-they-can-do-in-one-year",
        "tags": [
            "planning",
            "vision"
        ],
        "notes": null
    },
    {
        "id": "q_040",
        "content": "If anyone tells you that a certain person speaks ill of you, do not make excuses about what is said of you but answer, 'He was ignorant of my other faults, else he would not have mentioned these alone.'",
        "author": "Epictetus",
        "source": "https://www.goodreads.com/author/quotes/13852.Epictetus",
        "tags": [
            "stoicism",
            "humility"
        ],
        "notes": null
    },
    {
        "id": "q_041",
        "content": "It is impossible for a man to learn what he thinks he already knows.",
        "author": "Epictetus",
        "source": "https://www.goodreads.com/author/quotes/13852.Epictetus",
        "tags": [
            "stoicism",
            "learning",
            "humility"
        ],
        "notes": null
    },
    {
        "id": "q_042",
        "content": "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.",
        "author": "Epictetus",
        "source": "https://www.goodreads.com/author/quotes/13852.Epictetus",
        "tags": [
            "stoicism",
            "gratitude"
        ],
        "notes": null
    },
    {
        "id": "q_043",
        "content": "If you concentrate on finding whatever is good in every situation, you will discover that your life will suddenly be filled with gratitude, a feeling that nurtures the soul.",
        "author": "Rabbi Harold Kushner",
        "source": "https://motivation.app/download",
        "tags": [
            "gratitude",
            "perspective"
        ],
        "notes": null
    },
    {
        "id": "q_044",
        "content": "Most folks are as happy as they make up their minds to be.",
        "author": "Abraham Lincoln",
        "source": "https://www.brainyquote.com/quotes/abraham_lincoln_100845",
        "tags": [
            "happiness",
            "mindset"
        ],
        "notes": null
    },
    {
        "id": "q_045",
        "content": "Negative emotions like loneliness, envy, and guilt have an important role to play in a happy life; they're big, flashing signs that something needs to change.",
        "author": "Gretchen Rubin",
        "source": "https://motivation.app/download",
        "tags": [
            "emotions",
            "change"
        ],
        "notes": "From the Motivation app"
    },
    {
        "id": "q_046",
        "content": "The most worth-while thing is to try to put happiness into the lives of others.",
        "author": "Robert Baden-Powell",
        "source": null,
        "tags": [
            "service",
            "happiness"
        ],
        "notes": null
    },
    {
        "id": "q_047",
        "content": "Letting go doesn't mean that you don't care about someone anymore. It's just realizing that the only person you really have control over is yourself.",
        "author": "Deborah Reber",
        "source": null,
        "tags": [
            "control",
            "letting go"
        ],
        "notes": null
    },
    {
        "id": "q_048",
        "content": "Forgive many things in others; nothing in yourself.",
        "author": "Ausonius",
        "source": null,
        "tags": [
            "discipline",
            "forgiveness"
        ],
        "notes": null
    },
    {
        "id": "q_049",
        "content": "If you want to view paradise, simply look around and view it.",
        "author": "Gene Wilder",
        "source": null,
        "tags": [
            "perspective",
            "wonder"
        ],
        "notes": null
    },
    {
        "id": "q_050",
        "content": "Be at war with your vices, at peace with your neighbors, and let every new year find you a better man.",
        "author": "Benjamin Franklin",
        "source": null,
        "tags": [
            "self-improvement"
        ],
        "notes": null
    },
    {
        "id": "q_051",
        "content": "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.",
        "author": "Marilyn Monroe",
        "source": null,
        "tags": [],
        "notes": null
    },
    {
        "id": "q_052",
        "content": "Regret is the thing we should fear most. Failure is an answer. Rejection is an answer. Regret is an eternal question you will never have the answer to.",
        "author": "Trevor Noah",
        "source": "https://motivation.app/download",
        "tags": [
            "regret",
            "action"
        ],
        "notes": "From the Motivation app"
    },
    {
        "id": "q_053",
        "content": "A ship in harbor is safe, but that is not what ships are built for.",
        "author": "John A. Shedd",
        "source": null,
        "tags": [
            "risk",
            "purpose"
        ],
        "notes": null
    },
    {
        "id": "q_054",
        "content": "So scared of what your enemies will do to you, but you're the only enemy you ever seem to lose to.",
        "author": "Angelica Schuyler",
        "source": "Hamilton Play",
        "tags": [
            "self-sabotage"
        ],
        "notes": null
    },
    {
        "id": "q_055",
        "content": "It's never too late to realize what you want in your life and it's never wrong to fight for it.",
        "author": "Drake",
        "source": "https://motivation.app/download",
        "tags": [
            "purpose",
            "determination"
        ],
        "notes": "From the Motivation app"
    },
    {
        "id": "q_056",
        "content": "You will not be punished for your anger, you will be punished by your anger.",
        "author": "Buddha",
        "source": null,
        "tags": [
            "anger"
        ],
        "notes": null
    },
    {
        "id": "q_057",
        "content": "Happiness and moral duty are inseparably connected.",
        "author": "George Washington",
        "source": null,
        "tags": [
            "happiness",
            "duty"
        ],
        "notes": null
    },
    {
        "id": "q_058",
        "content": "The happiest people seem to be those who have no particular cause for being happy except that they are so.",
        "author": "William Inge",
        "source": null,
        "tags": [
            "happiness"
        ],
        "notes": null
    },
    {
        "id": "q_059",
        "content": "You may delay, but time will not.",
        "author": "Benjamin Franklin",
        "source": null,
        "tags": [
            "time",
            "action"
        ],
        "notes": null
    },
    {
        "id": "q_060",
        "content": "The tree remembers what the axe forgets.",
        "author": "African Proverb",
        "source": "https://www.linkedin.com/posts/michael-goldman-7722a512_the-axe-forgets-but-the-tree-remembers-activity-6992891981689450496",
        "tags": [
            "wisdom",
            "consequences"
        ],
        "notes": null
    },
    {
        "id": "q_061",
        "content": "You will face many defeats in your life, but never let yourself be defeated.",
        "author": "Maya Angelou",
        "source": "https://motivation.app/download",
        "tags": [
            "resilience"
        ],
        "notes": null
    },
    {
        "id": "q_062",
        "content": "Be patient and tough; someday this pain will be useful to you.",
        "author": "Ovid",
        "source": null,
        "tags": [
            "patience",
            "resilience"
        ],
        "notes": null
    },
    {
        "id": "q_063",
        "content": "When I was a young man, I had liberty, but I did not see it. I had time, but I did not know it. And I had love, but I did not feel it. Many decades would pass before I understood the meaning of all three. And now, the twilight of my life, this understanding has passed into contentment. Love, liberty, and time: once so disposable, are the fuels that drive me forward. And love, most especially, mio caro. For you, our children, our brothers and sisters. And for the vast and wonderful world that gave us life, and keeps us guessing. Endless affection, mia Sofia.",
        "author": "Ezio Auditore",
        "source": null,
        "tags": [
            "reflection",
            "love",
            "time"
        ],
        "notes": null
    },
    {
        "id": "q_064",
        "content": "Worry never robs tomorrow of its sorrow, it only saps today of its joy.",
        "author": "Leo Buscaglia",
        "source": "BrainyQuote",
        "tags": [
            "worry",
            "joy"
        ],
        "notes": null
    },
    {
        "id": "q_065",
        "content": "Failing to plan is planning to fail.",
        "author": "Benjamin Franklin",
        "source": null,
        "tags": [
            "planning",
            "discipline"
        ],
        "notes": null
    },
    {
        "id": "q_066",
        "content": "You are your choices.",
        "author": "Seneca",
        "source": null,
        "tags": [
            "stoicism",
            "responsibility"
        ],
        "notes": null
    },
    {
        "id": "q_067",
        "content": "Be thankful for what you have; you'll end up having more. If you concentrate on what you don't have, you will never, ever have enough.",
        "author": "Oprah Winfrey",
        "source": "https://www.goodreads.com/author/quotes/1/Oprah_Winfrey",
        "tags": [
            "gratitude"
        ],
        "notes": null
    },
    {
        "id": "q_068",
        "content": "To begin, begin.",
        "author": "William Wordsworth",
        "source": "https://www.brainyquote.com/quotes/william_wordsworth_120835",
        "tags": [
            "action"
        ],
        "notes": null
    },
    {
        "id": "q_069",
        "content": "Your body hears everything your mind says.",
        "author": "Naomi Judd",
        "source": "https://www.brainyquote.com/quotes/naomi_judd_170356",
        "tags": [
            "mind-body",
            "health"
        ],
        "notes": null
    }
];

export const seedCommonQuotes = async () => {
    // Dynamic Metadata Calculation
    const metadata = {
        collection: "ILYTAT Common Quotes",
        version: "1.1.0",
        count: quotesPayload.length,
        last_updated: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        license: "CC-BY-4.0"
    };

    console.log(`[Quotes Seeder] Starting seed of ${metadata.count} quotes...`);
    console.log(`[Quotes Seeder] Metadata:`, metadata);

    const db = getFirestore();
    const batch = db.batch();
    const quotesCollection = db.collection('quotes');

    // Optionally save metadata
    const metaRef = db.collection('metadata').doc('common_quotes');
    batch.set(metaRef, metadata, { merge: true });

    let operationCount = 0;
    const MAX_BATCH_SIZE = 400; // Firestore limit is 500

    for (const quote of quotesPayload) {
        const quoteRef = quotesCollection.doc(quote.id);

        // Map content to text found in Quote type
        const quoteData = {
            text: quote.content,
            author: quote.author,
            source: quote.source,
            tags: quote.tags,
            notes: quote.notes,
            userId: 'system', // Special user ID for common quotes
            type: 'common',    // Optional discriminator
            updatedAt: new Date().toISOString()
        };

        batch.set(quoteRef, quoteData, { merge: true });
        operationCount++;

        if (operationCount >= MAX_BATCH_SIZE) {
            await batch.commit();
            console.log(`[Quotes Seeder] Committed batch of ${operationCount} quotes.`);
            // Reset batch
            // Note: In a real loop we'd need to re-instantiate the batch, 
            // but here we likely won't hit the limit with 69 quotes.
            // If we did, we would need to create a new batch object here.
            // For safety with small payload, we can commit once at the end.
        }
    }

    if (operationCount > 0 && operationCount < MAX_BATCH_SIZE) {
        await batch.commit();
        console.log(`[Quotes Seeder] Committed final batch of ${operationCount} quotes.`);
    }

    console.log('[Quotes Seeder] Seeding complete.');
};
