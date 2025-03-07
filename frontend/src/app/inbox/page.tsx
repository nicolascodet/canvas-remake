'use client';

import { useState } from 'react';
import {
  ArchiveBoxIcon,
  StarIcon,
  TrashIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  content: string;
  course?: string;
}

const sampleEmails: Email[] = [
  {
    id: '1',
    from: 'prof.meme@university.edu',
    subject: 'Your Doge Analysis Needs Work',
    preview: 'Much disappoint, very concern...',
    timestamp: '2 hours ago',
    read: false,
    starred: true,
    content: `Dear Student,

Much concern, very worry. Your analysis of the Doge meme lacks depth. While "wow such meme" is technically accurate, I was hoping for more academic rigor.

Please revise your paper to include:
- Historical context (pre-Shiba era)
- Impact on cryptocurrency naming conventions
- Advanced usage of Comic Sans
- At least three (3) instances of "very" or "much"

Such deadline: Friday
Many extensions: Not available
Wow factor: Required

Best regards,
Professor Meme
Department of Advanced Memeology`,
    course: 'MEME-420'
  },
  {
    id: '2',
    from: 'napmaster@university.edu',
    subject: 'Urgent: Webcam Angle Critique',
    preview: 'Your last Zoom session revealed...',
    timestamp: '5 hours ago',
    read: true,
    starred: false,
    content: `Dear Student,

I noticed during your last Zoom session that your "thoughtful listening pose" needs work. Your snoring was clearly audible and the drool was visible.

Remember the key principles:
1. Camera slightly above eye level (hides closed eyes)
2. Strategic coffee mug placement (creates illusion of consciousness)
3. Occasional mouse movement (shows "engagement")
4. Pre-recorded nodding footage (advanced students only)

Feel free to book a one-on-one napping consultation.

Stay drowsy,
Professor Z. Z. Z.
Department of Strategic Napping`,
    course: 'NAPS-303'
  },
  {
    id: '3',
    from: 'netflix.committee@university.edu',
    subject: 'Concerning Binge-Watching Patterns',
    preview: 'Your rookie numbers are showing...',
    timestamp: '1 day ago',
    read: true,
    starred: true,
    content: `Dear Streaming Apprentice,

Your recent Netflix activity log shows concerning patterns. Only 6 episodes before taking a break? Pausing during climactic scenes to "sleep"? Using the "Skip Intro" button?

This is PROCR-101, not amateur hour.

Recommended improvements:
- Minimum 12-episode commitment per sitting
- Snack inventory should exceed 72 hours
- No bathroom breaks during season finales
- "Are you still watching?" should be your arch-nemesis

Your midterm requires completing an entire series in one weekend. Choose wisely.

Keep streaming,
The Binge-Watching Committee`,
    course: 'PROCR-101'
  },
  {
    id: '4',
    from: 'pizza.ethics@university.edu',
    subject: 'Re: Pineapple Incident',
    preview: 'We need to discuss what happened...',
    timestamp: '2 days ago',
    read: false,
    starred: false,
    content: `URGENT NOTICE

We are aware of your attempt to smuggle pineapple into yesterday's Traditional Pizza Theory class. This breach of protocol has been reported to the Italian Embassy.

Please submit a 1000-word apology letter addressing:
- Why Hawaiian pizza is not "just another topping"
- How this affects diplomatic relations with Naples
- A formal renouncement of fruit on pizza
- Your position on Chicago deep dish (trick question)

Your pizza privileges have been temporarily suspended.

Regards,
Pizza Ethics Committee
P.S. This message will self-destruct if exposed to anchovies`,
    course: 'PIZZA-505'
  }
];

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>(sampleEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composing, setComposing] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    content: ''
  });

  const toggleStar = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const markAsRead = (emailId: string) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, read: true } : email
    ));
  };

  const handleSend = () => {
    alert('Nice try! But this is a fake inbox. Your witty email will have to wait.');
    setComposing(false);
    setNewEmail({ to: '', subject: '', content: '' });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <button
          onClick={() => setComposing(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Compose
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email List */}
        <div className="col-span-1 border rounded-lg overflow-hidden">
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => {
                setSelectedEmail(email);
                markAsRead(email.id);
              }}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                !email.read ? 'bg-blue-50' : ''
              } ${selectedEmail?.id === email.id ? 'bg-gray-100' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id);
                      }}
                      className="text-gray-400 hover:text-yellow-400"
                    >
                      {email.starred ? (
                        <StarIconSolid className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-5 w-5" />
                      )}
                    </button>
                    <span className="font-semibold">{email.from}</span>
                  </div>
                  <div className="text-sm font-medium">{email.subject}</div>
                  <div className="text-sm text-gray-600">{email.preview}</div>
                </div>
                <div className="text-xs text-gray-500">{email.timestamp}</div>
              </div>
              {email.course && (
                <div className="mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {email.course}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Email Content */}
        <div className="col-span-2 border rounded-lg p-4">
          {selectedEmail ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{selectedEmail.subject}</h2>
                  <div className="text-sm text-gray-600">
                    From: {selectedEmail.from}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <ArchiveBoxIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <TrashIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="prose max-w-none whitespace-pre-wrap">
                {selectedEmail.content}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              Select an email to read
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {composing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Message</h2>
              <button
                onClick={() => setComposing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="To"
                value={newEmail.to}
                onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
              <input
                type="text"
                placeholder="Subject"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
              <textarea
                placeholder="Write something clever..."
                value={newEmail.content}
                onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                rows={10}
                className="w-full border rounded-md px-3 py-2"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setComposing(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                >
                  <PaperAirplaneIcon className="h-5 w-5 mr-1" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 