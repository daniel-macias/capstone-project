import { z } from 'zod';

export const NewsletterConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),

  feeds: z.array(z.string().url()),
  keywords: z.array(z.string()),
  category: z.string(),

  dateRange: z.enum(['Past 24h', 'Past Week', 'Custom']),
  frequency: z.enum(['Daily', 'Weekly', 'Custom']),

  outputFormat: z.enum(['docx', 'markdown', 'google-doc']),
  cloudStorage: z.enum(['GoogleDrive', 'OneDrive', 'None']),

  createdAt: z.string().datetime(),
  lastGeneratedAt: z.string().datetime().optional(),

  brandSettings: z
    .object({
      logoUrl: z.string().url().optional(),
      accentColor: z.string().optional(),
      fontFamily: z.string().optional(),
      includeHeader: z.boolean().optional(),
      includeFooter: z.boolean().optional(),
    })
    .optional(),

  emailIntegration: z
    .object({
      provider: z.enum(['Mailchimp', 'Substack', 'SMTP', 'None']),
      listId: z.string().optional(),
      fromEmail: z.string().email().optional(),
      sendOnGenerate: z.boolean().optional(),
    })
    .optional(),

  outputDestinations: z
    .object({
      folderPath: z.string().optional(),
      webhookUrl: z.string().url().optional(),
    })
    .optional(),

   schedule: z
  .object({
    startAt: z.string().datetime(), // ISO 8601 timestamp
    timezone: z.string().optional(), // e.g. "America/Tegucigalpa"
  })
  .optional(),
});
