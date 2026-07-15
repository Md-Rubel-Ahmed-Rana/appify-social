import { S3Service } from "@/modules/aws/s3.service";
import { emitter } from "./eventEmitter";

emitter.on("s3.files.deleted", async (public_ids: string[]) => {
  console.log(`✅ AWS S3 Event received files.deleted event.`);
  // delete the resources
  await S3Service.deleteMultipleFiles(public_ids);
});

emitter.on("s3.file.deleted", async (public_id: string) => {
  console.log(`✅ AWS S3 Event received files.deleted event.`);
  // delete the resource
  await S3Service.deleteSingleFile(public_id);
});
