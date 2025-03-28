'use client';

import { useEffect, useState } from 'react';
import { NewsletterConfig } from '@/lib/types';

type Props = {
  initialValues?: NewsletterConfig;
};

export default function NewsletterForm({ initialValues }: Props) {
  const [rssFeed, setRssFeed] = useState('');
  const [rssList, setRssList] = useState<string[]>([]);
  const [keywords, setKeywords] = useState('');
  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('Past Week');
  const [frequency, setFrequency] = useState('Weekly');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [outputFormat, setOutputFormat] = useState('docx');
  const [cloudStorage, setCloudStorage] = useState('GoogleDrive');

  const [brandSettings, setBrandSettings] = useState({
    logoUrl: '',
    accentColor: '',
    fontFamily: '',
    includeHeader: false,
    includeFooter: false,
  });

  const [emailIntegration, setEmailIntegration] = useState({
    provider: 'None',
    listId: '',
    fromEmail: '',
    sendOnGenerate: false,
  });

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description || '');
      setRssList(initialValues.feeds);
      setKeywordList(initialValues.keywords);
      setCategory(initialValues.category);
      setDateRange(initialValues.dateRange);
      setFrequency(initialValues.frequency);
      setOutputFormat(initialValues.outputFormat);
      setCloudStorage(initialValues.cloudStorage);

      if (initialValues.brandSettings) {
        setBrandSettings({
          logoUrl: initialValues.brandSettings.logoUrl ?? '',
          accentColor: initialValues.brandSettings.accentColor ?? '',
          fontFamily: initialValues.brandSettings.fontFamily ?? '',
          includeHeader: initialValues.brandSettings.includeHeader ?? false,
          includeFooter: initialValues.brandSettings.includeFooter ?? false,
        });
      }

      if (initialValues.emailIntegration) {
        setEmailIntegration({
          provider: initialValues.emailIntegration.provider ?? 'None',
          listId: initialValues.emailIntegration.listId ?? '',
          fromEmail: initialValues.emailIntegration.fromEmail ?? '',
          sendOnGenerate: initialValues.emailIntegration.sendOnGenerate ?? false,
        });
      }
    }
  }, [initialValues]);

  const handleAddRss = () => {
    if (rssFeed && !rssList.includes(rssFeed)) {
      setRssList([...rssList, rssFeed]);
      setRssFeed('');
    }
  };

  const handleRemoveRss = (index: number) => {
    setRssList(rssList.filter((_, i) => i !== index));
  };

  const handleAddKeyword = () => {
    if (keywords && !keywordList.includes(keywords)) {
      setKeywordList([...keywordList, keywords]);
      setKeywords('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywordList(keywordList.filter((_, i) => i !== index));
  };

  const handleFetchNews = () => {
    console.log('Saving newsletter with:', {
      name,
      description,
      rssList,
      keywordList,
      category,
      dateRange,
      frequency,
      outputFormat,
      cloudStorage,
      brandSettings,
      emailIntegration,
    });
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-4 text-black">
      <div className="w-full max-w-screen-xl bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-800 mb-2">Newsletter Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cybersecurity Weekly"
            />
          </div>

          <div>
            <label className="block text-gray-800 mb-2">Description</label>
            <textarea
              className="w-full p-2 border rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your newsletter..."
            />
          </div>

          {/* RSS Feeds */}
          <div>
            <label className="block text-gray-800 mb-2">Enter RSS Feeds & Websites</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-md"
                value={rssFeed}
                onChange={(e) => setRssFeed(e.target.value)}
                placeholder="https://example.com/feed"
              />
              <button onClick={handleAddRss} className="bg-blue-500 text-white px-3 py-2 rounded-md">+</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {rssList.map((feed, index) => (
                <span key={index} className="bg-gray-200 px-3 py-1 rounded-full flex items-center">
                  {feed}
                  <button onClick={() => handleRemoveRss(index)} className="ml-2 text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-gray-800 mb-2">Enter Keywords</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-md"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="malware, ransomware..."
              />
              <button onClick={handleAddKeyword} className="bg-blue-500 text-white px-3 py-2 rounded-md">+</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {keywordList.map((word, index) => (
                <span key={index} className="bg-gray-200 px-3 py-1 rounded-full flex items-center">
                  {word}
                  <button onClick={() => handleRemoveKeyword(index)} className="ml-2 text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-800 mb-1">Category</label>
            <input
              className="w-full p-2 border rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Cybersecurity"
            />
            <p className="text-xs text-gray-500 mt-1">Keep it short and descriptive</p>
          </div>

          {/* Date & Frequency */}
          <div>
            <label className="block text-gray-800 mb-2">Select Date Range</label>
            <select className="w-full p-2 border rounded-md" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option>Past 24h</option>
              <option>Past Week</option>
              <option>Custom...</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 mb-2">Newsletter Frequency</label>
            <select className="w-full p-2 border rounded-md" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Custom...</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 mb-2">Output Format</label>
            <select className="w-full p-2 border rounded-md" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}>
              <option>docx</option>
              <option>markdown</option>
              <option>google-doc</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 mb-2">Cloud Storage</label>
            <select className="w-full p-2 border rounded-md" value={cloudStorage} onChange={(e) => setCloudStorage(e.target.value)}>
              <option>GoogleDrive</option>
              <option>OneDrive</option>
              <option>None</option>
            </select>
          </div>
        </div>

        {/* Right Column for Optional Fields */}
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg text-gray-800 mb-2">Brand Settings (optional)</h2>
            <input
              type="text"
              placeholder="Logo URL"
              value={brandSettings.logoUrl}
              onChange={(e) => setBrandSettings({ ...brandSettings, logoUrl: e.target.value })}
              className="w-full mb-2 p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Accent Color"
              value={brandSettings.accentColor}
              onChange={(e) => setBrandSettings({ ...brandSettings, accentColor: e.target.value })}
              className="w-full mb-2 p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Font Family"
              value={brandSettings.fontFamily}
              onChange={(e) => setBrandSettings({ ...brandSettings, fontFamily: e.target.value })}
              className="w-full mb-2 p-2 border rounded-md"
            />
            <label className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={brandSettings.includeHeader}
                onChange={(e) => setBrandSettings({ ...brandSettings, includeHeader: e.target.checked })}
              />
              Include Header
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={brandSettings.includeFooter}
                onChange={(e) => setBrandSettings({ ...brandSettings, includeFooter: e.target.checked })}
              />
              Include Footer
            </label>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-800 mb-2">Email Integration (optional)</h2>
            <select
              value={emailIntegration.provider}
              onChange={(e) => setEmailIntegration({ ...emailIntegration, provider: e.target.value as any })}
              className="w-full mb-2 p-2 border rounded-md"
            >
              <option>None</option>
              <option>Mailchimp</option>
              <option>Substack</option>
              <option>SMTP</option>
            </select>
            <input
              type="text"
              placeholder="List ID"
              value={emailIntegration.listId}
              onChange={(e) => setEmailIntegration({ ...emailIntegration, listId: e.target.value })}
              className="w-full mb-2 p-2 border rounded-md"
            />
            <input
              type="email"
              placeholder="From Email"
              value={emailIntegration.fromEmail}
              onChange={(e) => setEmailIntegration({ ...emailIntegration, fromEmail: e.target.value })}
              className="w-full mb-2 p-2 border rounded-md"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={emailIntegration.sendOnGenerate}
                onChange={(e) => setEmailIntegration({ ...emailIntegration, sendOnGenerate: e.target.checked })}
              />
              Send email on generate
            </label>
          </div>
        </div>

        <div className="col-span-full">
          <button onClick={handleFetchNews} className="w-full bg-green-500 text-white p-2 rounded-md mt-6">
            Save & Fetch News
          </button>
        </div>
      </div>
    </div>
  );
}
