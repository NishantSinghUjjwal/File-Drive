'use client'
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(100, { message: 'Title must be less than 100 characters' }),
  file: z
    .custom<FileList>(val => val instanceof FileList, 'Required')
    .refine(files => files.length > 0, 'Required')
})

// 1. Define your form.


export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined
    },
  })

  const fileRef = form.register('file')
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.file[0] || !orgId) return
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });
    const { storageId } = await result.json();
    try {

      await createFile({
        name: values.title,
        orgId,
        fileId: storageId
      })
      form.reset()
      setIsFormOpen(false)
      toast({
        variant: 'success',
        title: 'File uploaded successfully',
        duration: 5000
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong while uploading file',
        duration: 5000
      })
    }
  }

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  let orgId: string | undefined
  const organization = useOrganization()
  const user = useUser()
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const createFile = useMutation(api.files.createFile)
  const files = useQuery(api.files.getFiles,
    orgId ? { orgId } : 'skip')

  const { toast } = useToast()
  return (
    <main className=" pt-12 px-12">
      <div className=" flex justify-between items-center">
        <h1 className=" text-4xl font-bold">Your files</h1>
        <Toaster />
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload file</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter file name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file"
                      render={() => (
                        <FormItem>
                          <FormLabel>Select file</FormLabel>
                          <FormControl className=" cursor-pointer">
                            <Input className=" cursor-pointer" type="file" {...fileRef} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className=" flex items-center gap-2" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className=" h-4 w-4 animate-spin" />
                      }
                      Submit
                    </Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>


      </div>
      {files?.map(file => <div>{file.name}</div>)}

    </main>
  );
}
