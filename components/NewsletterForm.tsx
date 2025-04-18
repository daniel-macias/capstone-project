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
import { stat } from 'fs';
import { useRouter } from 'next/navigation';
import { Factory } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Plus, X } from "lucide-react";


type Props = {
  initialValues?: NewsletterConfig;
};

export default function NewsletterForm({ initialValues }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState('pending');
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
  const [lastGenerated, setLastGenerated] = useState('');
  const [docId, setDocId] = useState('');
  const [tone, setTone] = useState('professional');
  

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
      setStatus(initialValues.status ?? 'pending');
      setLastGenerated(initialValues.lastGenerated ?? '');
      setDocId(initialValues.docId ?? '');
      setTone(initialValues.tone);

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

  const handleDownloadGeneratedNewsletter = async () => {
    if (initialValues?.id) {
      try{
        await fetch('/api/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: initialValues.id,
            status: 'generating',
          }),
        });
      }catch{
        console.log("ERROR")
      }
    }
    

  }

  const handleDriveGeneratedNewsletter = () => {
    if (!docId) return;
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${docId}`;
    window.open(downloadUrl, "_blank");
  };
  
  const handleGoogleDocsGeneratedNewsletter = () => {
    if (!docId) return;
    const docUrl = `https://docs.google.com/document/d/${docId}/edit`;
    window.open(docUrl, "_blank");
  };
  

  const handleSave = async () => {
    await handleFetchNews();  
    router.push('/');      
  };

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
      status,
      lastGenerated,
      docId,
      tone
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

  const handleDelete = async () => {
    try {
      if (!initialValues?.id) {
        console.error('No ID to delete');
        return;
      }
  
      const res = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: initialValues.id }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to delete newsletter');
      }
  
      console.log('Deleted successfully');
    } catch (error) {
      console.error('Error deleting newsletter:', error);
    }
  };

  const handleClickDelete = async () => {
    await handleDelete();
    router.push('/');   
  };

  const handleGenarateClick = async () => {
    await handleGenerateNewsletter();  
    router.push('/');   
  };

  const handleGenerateNewsletter = async () => {
    if (!initialValues?.id) {
      console.error('No ID available to generate newsletter');
      return;
    }
  
    try {
      await fetch('/api/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initialValues.id,
          status: 'generating',
        }),
      });

      const payload = {
        id: initialValues.id,
        lastGenerated: new Date().toISOString(),
        docId: docId, 
      };
  
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        throw new Error('Failed to trigger newsletter generation');
      }
  
      const data = await res.json();
      console.log('Newsletter generation triggered:', data);
      
    } catch (error) {
      console.error('Error generating newsletter:', error);
    }
  };

  return (
    <div className="flex justify-center p-4 text-black">
      <div className="w-full max-w-screen-xl bg-background dark:bg-zinc-800 shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
        <h2 className='font-semibold text-lg text-foreground'>General Parameters</h2>
        <div>
  <Label htmlFor="name" className="mb-2 block text-foreground">
    Newsletter Name
  </Label>
  <Input
    id="name"
    className='text-foreground'
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="e.g. Cybersecurity Weekly"
  />
</div>

<div>
  <Label htmlFor="description" className="mb-2 block text-foreground">
    Description
  </Label>
  <Textarea
    id="description"
    className='text-foreground'
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="A short description of your newsletter..."
  />
</div>


          {/* RSS Feeds */}
          <div>
            <Label className="mb-2 block text-foreground">Enter RSS Feeds & Websites</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                className="flex-1 text-foreground"
                value={rssFeed}
                onChange={(e) => setRssFeed(e.target.value)}
                placeholder="e.g. https://example.com/feed"
              />
              <Button
                type="button"
                onClick={handleAddRss}
                className="p-2 bg-green-700 hover:bg-green-800 text-white rounded-md"
                size="icon"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {rssList.map((feed, index) => (
                <span
                  key={index}
                  className="bg-zinc-700 px-3 py-1 rounded-full flex items-center text-foreground"
                >
                  {feed}
                  <button
                    onClick={() => handleRemoveRss(index)}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <Label className="mb-2 block text-foreground">Enter Keywords</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                className="flex-1 text-foreground"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. malware, ransomware..."
              />
              <Button
                type="button"
                onClick={handleAddKeyword}
                className="p-2 bg-green-700 hover:bg-green-800 text-white rounded-md"
                size="icon"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {keywordList.map((word, index) => (
                <span
                  key={index}
                  className="bg-zinc-700 px-3 py-1 rounded-full flex items-center text-foreground"
                >
                  {word}
                  <button
                    onClick={() => handleRemoveKeyword(index)}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

                           {/* Category */}
                           <div>
            <Label htmlFor="category" className="mb-1 block text-foreground">Topic</Label>
            <Input
              id="category"
              className='text-foreground'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Cybersecurity"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Keep it short and descriptive
            </p>
          </div>


        </div>

        {/* Right Column for Optional Fields */}
        <div className="space-y-6">

        <h2 className='font-semibold text-lg text-foreground mb-6'>Generation Settings</h2>

        <div>
            <Label className="mb-2 block text-foreground">Select Tone</Label>
            <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-full bg-background text-foreground border-border">
              <SelectValue placeholder="Select Tone..." />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground border-border">
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="excited">Excited</SelectItem>
              <SelectItem value="analytical">Analytical</SelectItem>
              <SelectItem value="concise">Concise</SelectItem>
              <SelectItem value="dramatic">Dramatic</SelectItem>
            </SelectContent>
          </Select>
          </div>

          <div>
          
          <Label className="mb-2 block text-foreground">Select Date Range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full bg-background text-foreground border-border">
            <SelectValue placeholder="Select Date Range..." />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground border-border">
            <SelectItem value="Past 24h">Past 24h</SelectItem>
            <SelectItem value="Past Week">Past Week</SelectItem>
            <SelectItem value="Past Month">Past Month</SelectItem>
          </SelectContent>
        </Select>

        </div>

        <div>
          <Label className="mb-2 block text-foreground">Output Format</Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
          <SelectTrigger className="w-full bg-background text-foreground border-border">
            <SelectValue placeholder="Select Format..." />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground border-border">
            <SelectItem value="docx">docx</SelectItem>
            <SelectItem value="markdown">markdown</SelectItem>
            <SelectItem value="google-doc">google-doc</SelectItem>
          </SelectContent>
        </Select>
        </div>

        <div>
          <Label className="mb-2 block text-foreground">Cloud Storage</Label>
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

          <hr />
          
          <div className="col-span-full border border-border rounded-lg p-4 space-y-4">
          {/* Status and Last Generated */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-foreground">
              Status: <span className="capitalize">{status}</span>
            </span>
            {lastGenerated && (
              <span className="text-xs text-muted-foreground mt-2 sm:mt-0">
                Last generated: {new Date(lastGenerated).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-stretch sm:space-x-4 w-full">
            {/* Botón Verde - Generate Newsletter */}
            <div className="w-full sm:w-1/3 flex">
              <Dialog>
                <DialogTrigger asChild>
                <Button disabled={initialValues? false : true} className="flex-1 h-full bg-green-700 hover:bg-green-800 text-white p-2 rounded-md flex flex-col items-center justify-center">
                  <span className="text-base font-semibold">Generate Newsletter</span>
                </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate</DialogTitle>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generating will create a new file on your drive. Are you sure?
                    </p>
                    <Button
                      onClick={handleGenarateClick}
                      className="w-full bg-green-500 text-white p-2 rounded-md"
                    >
                      Confirm Generate
                    </Button>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            {/* Botones Azules */}
            <div className="flex-1 flex flex-col justify-between space-y-2 mt-4 sm:mt-0">
              <Button
                onClick={handleDriveGeneratedNewsletter}
                disabled={status !== 'ready'}
                className="w-full bg-cyan-800 hover:bg-cyan-900 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download Generated
              </Button>
              <Button
                onClick={handleGoogleDocsGeneratedNewsletter}
                disabled={status !== 'ready'}
                className="w-full bg-cyan-800 hover:bg-cyan-900 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View in Google Docs
              </Button>
            </div>
          </div>



          {status !== 'ready' && (
            <div className="text-sm text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 p-2 rounded-md">
              You need to generate a newsletter first before downloading it.
            </div>
          )}
        </div>
        <div className="flex space-x-2 w-full">
          {/* Save Changes Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-green-700 hover:bg-green-800 text-white p-2 rounded-md">
                Save Changes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to save your changes?</DialogTitle>
                <Button onClick={handleSave} className="w-full bg-green-500 text-white p-2 rounded-md">
                  Save Changes
                </Button>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog (only if editing) */}
          {initialValues && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-10 h-10 p-0 bg-red-700 hover:bg-red-800 text-white rounded-md flex items-center justify-center">
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete your newsletter?</DialogTitle>
                  <Button onClick={handleClickDelete} className="w-full bg-red-500 text-white p-2 rounded-md">
                    Delete
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
          
        </div>
      </div>
    </div>
  );
}
