'use client';

import { useEffect, useState } from 'react';
import { NewsletterConfig } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
  const [active, setActive] = useState(true);
  const [description, setDescription] = useState('');
  const [outputFormat, setOutputFormat] = useState('docx');
  const [cloudStorage, setCloudStorage] = useState('GoogleDrive');
  const [schedule, setSchedule] = useState({
    startAt: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  });
  

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
      setActive(initialValues.active);
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

      if (initialValues.schedule) {
        const raw = initialValues.schedule.startAt;
        const localFormat = raw ? new Date(raw).toISOString().slice(0, 16) : '';
        setSchedule({
          startAt: localFormat,
          timezone: initialValues.schedule.timezone ?? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'),
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

  const handleDownloadExample = () => {
    console.log("Downloading example...")
  }

  const handleFetchNews = async () => {
    const payload: any = {
      name,
      active,
      description,
      feeds: rssList,
      keywords: keywordList,
      category,
      dateRange,
      frequency,
      outputFormat,
      cloudStorage,
      brandSettings,
      emailIntegration,
      schedule,
    };
  
    const isEditing = !!initialValues;
    if (isEditing) {
      payload.id = initialValues.id;
    }
  
    const res = await fetch(isEditing ? "/api/patch" : "/api/upload", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const json = await res.json();
      console.log("Response from proxy:", json);
    } else {
      const text = await res.text();
      console.log("Non-JSON response:", text);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-4 text-black">
      <div className="w-full max-w-screen-xl bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
        <div>
  <Label htmlFor="name" className="mb-2 block">
    Newsletter Name
  </Label>
  <Input
    id="name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Cybersecurity Weekly"
  />
</div>

<div>
  <Label htmlFor="description" className="mb-2 block">
    Description
  </Label>
  <Textarea
    id="description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="A short description of your newsletter..."
  />
</div>


          {/* RSS Feeds */}
          <div>
            <Label className="mb-2 block">Enter RSS Feeds & Websites</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                className="flex-1"
                value={rssFeed}
                onChange={(e) => setRssFeed(e.target.value)}
                placeholder="https://example.com/feed"
              />
              <Button type="button" onClick={handleAddRss}>
                +
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {rssList.map((feed, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
                >
                  {feed}
                  <button
                    onClick={() => handleRemoveRss(index)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <Label className="mb-2 block">Enter Keywords</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                className="flex-1"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="malware, ransomware..."
              />
              <Button type="button" onClick={handleAddKeyword}>
                +
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {keywordList.map((word, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
                >
                  {word}
                  <button
                    onClick={() => handleRemoveKeyword(index)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="mb-1 block">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Cybersecurity"
            />
            <p className="text-xs text-gray-500 mt-1">
              Keep it short and descriptive
            </p>
          </div>


          <div>
          <Label className="mb-2 block">Select Date Range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Date Range..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Past 24h">Past 24h</SelectItem>
              <SelectItem value="Past Week">Past Week</SelectItem>
              <SelectItem value="Past Month">Past Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Output Format</Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Format..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="docx">docx</SelectItem>
              <SelectItem value="markdown">markdown</SelectItem>
              <SelectItem value="google-doc">google-doc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Cloud Storage</Label>
          <Select value={cloudStorage} onValueChange={setCloudStorage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Cloud Storage..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GoogleDrive">GoogleDrive</SelectItem>
              <SelectItem value="OneDrive">OneDrive</SelectItem>
              <SelectItem value="None">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>

        {/* Right Column for Optional Fields */}
        <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg text-gray-800 mb-2">Brand Settings (optional)</h2>

          <Input
            type="text"
            placeholder="Logo URL"
            value={brandSettings.logoUrl}
            onChange={(e) =>
              setBrandSettings({ ...brandSettings, logoUrl: e.target.value })
            }
          />

          <Input
            type="text"
            placeholder="Accent Color"
            value={brandSettings.accentColor}
            onChange={(e) =>
              setBrandSettings({ ...brandSettings, accentColor: e.target.value })
            }
            className="mt-2"
          />

          <Input
            type="text"
            placeholder="Font Family"
            value={brandSettings.fontFamily}
            onChange={(e) =>
              setBrandSettings({ ...brandSettings, fontFamily: e.target.value })
            }
            className="mt-2"
          />

          <div className="flex items-center space-x-2 mt-3">
            <Checkbox
              id="include-header"
              checked={brandSettings.includeHeader}
              onCheckedChange={(checked) =>
                setBrandSettings({ ...brandSettings, includeHeader: Boolean(checked) })
              }
            />
            <Label htmlFor="include-header">Include Header</Label>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="include-footer"
              checked={brandSettings.includeFooter}
              onCheckedChange={(checked) =>
                setBrandSettings({ ...brandSettings, includeFooter: Boolean(checked) })
              }
            />
            <Label htmlFor="include-footer">Include Footer</Label>
          </div>
        </div>



          <div className="space-y-3">
          <h2 className="text-left font-semibold text-lg text-gray-800 mb-2">
            Email Integration (optional)
          </h2>

          <Select
            value={emailIntegration.provider}
            onValueChange={(value) =>
              setEmailIntegration({ ...emailIntegration, provider: value as any })
            }
            disabled={!emailIntegration.sendOnGenerate}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Provider..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="Mailchimp">Mailchimp</SelectItem>
              <SelectItem value="Substack">Substack</SelectItem>
              <SelectItem value="SMTP">SMTP</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="List ID"
            value={emailIntegration.listId}
            onChange={(e) =>
              setEmailIntegration({ ...emailIntegration, listId: e.target.value })
            }
            disabled={!emailIntegration.sendOnGenerate}
          />

          <Input
            type="email"
            placeholder="From Email"
            value={emailIntegration.fromEmail}
            onChange={(e) =>
              setEmailIntegration({
                ...emailIntegration,
                fromEmail: e.target.value,
              })
            }
            disabled={!emailIntegration.sendOnGenerate}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="send-on-generate"
              checked={emailIntegration.sendOnGenerate}
              onCheckedChange={(checked) =>
                setEmailIntegration({
                  ...emailIntegration,
                  sendOnGenerate: Boolean(checked),
                })
              }
            />
            <Label htmlFor="send-on-generate">Send email on generate</Label>
          </div>
        </div>
          <hr />
          <h2 className="text-left font-semibold text-lg text-gray-800 mb-2">
            Scheduling and Workflow
          </h2>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked)}
            />
            <Label htmlFor="active">Active</Label>
          </div>
            <div>
            <Label htmlFor="schedule-start">Schedule Start</Label>
            <Input
              id="schedule-start"
              type="datetime-local"
              value={schedule.startAt}
              onChange={(e) => setSchedule({ ...schedule, startAt: e.target.value })}
            />
            </div>
            <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Frequency..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">From the schedule start time</p>
          </div>
          <div className="col-span-full">
            <Button onClick={handleDownloadExample} className="w-full bg-blue-500 text-white p-2 rounded-md ">
                Download Example
            </Button>
            </div>
          <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-green-500 text-white p-2 rounded-md">
              Save Newsletter
            </Button>
          </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your newsletter is about to go live!</DialogTitle>
                <DialogDescription>
                    <p><span className="font-medium text-black">Name:</span> {name}</p>
                    <p><span className="font-medium text-black">Description:</span> {description}</p>
                    <p><span className="font-medium text-black">Start Time:</span> {schedule.startAt}</p>
                    <p><span className="font-medium text-black">Frequency:</span> {frequency}</p>
                </DialogDescription>
                <Button onClick={handleFetchNews} className="w-full bg-green-500 text-white p-2 rounded-md">
            Save Newsletter
          </Button>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        
      </div>
    </div>
  );
}
