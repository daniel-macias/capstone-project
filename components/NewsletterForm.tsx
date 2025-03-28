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
  const [selectedCategory, setSelectedCategory] = useState('Cybersecurity');
  const [dateRange, setDateRange] = useState('Past Week');
  const [frequency, setFrequency] = useState('Weekly');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [outputFormat, setOutputFormat] = useState('docx');
  const [cloudStorage, setCloudStorage] = useState('GoogleDrive');

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description || '');
      setRssList(initialValues.feeds);
      setKeywordList(initialValues.keywords);
      setSelectedCategory(initialValues.category);
      setDateRange(initialValues.dateRange);
      setFrequency(initialValues.frequency);
      setOutputFormat(initialValues.outputFormat);
      setCloudStorage(initialValues.cloudStorage);
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
      selectedCategory,
      dateRange,
      frequency,
      outputFormat,
      cloudStorage,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 text-black">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Automated Newsletter Generator</h1>

        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Newsletter Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cybersecurity Weekly"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Description</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of your newsletter..."
          />
        </div>

        {/* RSS Feed Input */}
        <div className="mb-4">
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

        {/* Keyword Filtering */}
        <div className="mb-4">
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
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Category</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>Cybersecurity</option>
            <option>AI</option>
            <option>Finance</option>
            <option>Custom</option>
          </select>
        </div>

        {/* Date Range & Frequency */}
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Select Date Range</label>
          <select className="w-full p-2 border rounded-md" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option>Past 24h</option>
            <option>Past Week</option>
            <option>Custom...</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Newsletter Frequency</label>
          <select className="w-full p-2 border rounded-md" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Custom...</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Output Format</label>
          <select
            className="w-full p-2 border rounded-md"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            <option>docx</option>
            <option>markdown</option>
            <option>google-doc</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Cloud Storage</label>
          <select
            className="w-full p-2 border rounded-md"
            value={cloudStorage}
            onChange={(e) => setCloudStorage(e.target.value)}
          >
            <option>GoogleDrive</option>
            <option>OneDrive</option>
            <option>None</option>
          </select>
        </div>

        {/* Save Button */}
        <button onClick={handleFetchNews} className="w-full bg-green-500 text-white p-2 rounded-md mt-4">Save & Fetch News</button>
      </div>
    </div>
  );
}
