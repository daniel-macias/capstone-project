export type NewsletterConfig = {
    id: string;
    active: boolean;
    name: string;
    description: string;
  
    feeds: string[];
    keywords: string[];
    category: string;
  
    dateRange: 'Past 24h' | 'Past Week' | 'Custom';
    frequency: 'Daily' | 'Weekly' | 'Custom';
  
    outputFormat: 'docx' | 'markdown' | 'google-doc';
    cloudStorage: 'GoogleDrive' | 'OneDrive' | 'None';
  
    createdAt: string;
  
    brandSettings?: {
      logoUrl?: string;
      accentColor?: string;
      fontFamily?: string;
      includeHeader?: boolean;
      includeFooter?: boolean;
    };
  
    emailIntegration?: {
      provider: 'Mailchimp' | 'Substack' | 'SMTP' | 'None';
      listId?: string;
      fromEmail?: string;
      sendOnGenerate?: boolean;
    };
  
    outputDestinations?: {
      folderPath?: string;
      webhookUrl?: string;
    };

    schedule?: {
        startAt: string;
        timezone?: string;
    };

    status: 'pending'|'generating'|'ready';
    lastGenerated: string;
    docId?: string;
  };