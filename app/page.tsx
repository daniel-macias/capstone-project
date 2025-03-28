'use client';

import { useState } from 'react';

export default function Page() {
  const [rssFeed, setRssFeed] = useState('');
  const [rssList, setRssList] = useState<string[]>([]);
  const [keywords, setKeywords] = useState('');
  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Cybersecurity');
  const [dateRange, setDateRange] = useState('Past Week');
  const [frequency, setFrequency] = useState('Weekly');

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
    console.log('Fetching news with:', {
      rssList,
      keywordList,
      selectedCategory,
      dateRange,
      frequency,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Automated Newsletter Generator</h1>
        
        {/* RSS Feed Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Enter RSS Feeds & Websites</label>
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
          <label className="block text-gray-700 mb-2">Enter Keywords</label>
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

        {/* Date Range & Frequency */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Date Range</label>
          <select className="w-full p-2 border rounded-md" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option>Past 24h</option>
            <option>Past Week</option>
            <option>Custom...</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Newsletter Frequency</label>
          <select className="w-full p-2 border rounded-md" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Custom...</option>
          </select>
        </div>

        {/* Fetch News Button */}
        <button onClick={handleFetchNews} className="w-full bg-green-500 text-white p-2 rounded-md mt-4">Save & Fetch News</button>
      </div>
    </div>
  );
}
