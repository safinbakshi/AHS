import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

export async function downloadImage(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  const buffer = await response.buffer();
  await fs.writeFile(filename, buffer);
}