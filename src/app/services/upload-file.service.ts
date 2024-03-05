import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private storage: Storage) { }

  uploadFile(filePath: string, file: File): Promise<any> {
    const storageRef = ref(this.storage, filePath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise<any>((resolve, reject) => {
      uploadTask.on('state_changed',
        (_snapshot) => { },
        (error) => reject(error),
        () => getDownloadURL(uploadTask.snapshot.ref).then(url => resolve(url))
      )
    })
  }

  deleteFile(filePath: string): Promise<any> {
    const storageRef = ref(this.storage, filePath)
    return deleteObject(storageRef)
  }

}