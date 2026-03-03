import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  constructor(private http: HttpClient) {}

  async uploadImage(file: File): Promise<string> {
    const cloudName = environment.cloudinary.cloudName;
    const preset = environment.cloudinary.uploadPreset;

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset);

    const res: any = await firstValueFrom(this.http.post(url, form));
    return res.secure_url as string;
  }
}