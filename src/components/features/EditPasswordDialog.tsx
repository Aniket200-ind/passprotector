"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
// import { generatePassword } from "@/lib/utils/password-generator"

// Form schema
const formSchema = z.object({
  id: z.string(),
  siteName: z.string().min(1, "Site name is required"),
  siteUrl: z.string().min(1, "Site URL is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  category: z.enum([
    "Personal",
    "Work",
    "Social",
    "Finance",
    "Shopping",
    "Other",
  ]),
  strength: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Password {
  id: string;
  siteName: string;
  siteUrl: string;
  username?: string;
  decryptedPassword?: string;
  category: "Personal" | "Work" | "Social" | "Finance" | "Shopping" | "Other";
  strength: string;
  createdAt: string;
}

interface EditPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: Password;
  onSuccess: () => void;
}

export function EditPasswordDialog({
  open,
  onOpenChange,
  password,
  onSuccess,
}: EditPasswordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: password.id,
      siteName: password.siteName,
      siteUrl: password.siteUrl,
      username: password.username || "",
      password: password.decryptedPassword || "",
      category: password.category,
      strength: password.strength,
    },
  });

  // Fetch the decrypted password if not already available
  useEffect(() => {
    const fetchPassword = async () => {
      if (!password.decryptedPassword && open) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/passwords/${password.id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch password");
          }

          const data = await response.json();
          if (data.success && data.password) {
            form.setValue("password", data.password.decryptedPassword);
            // Set initial strength based on the fetched password
            setStrengthFromLabel(password.strength);
          }
        } catch (error) {
          console.error("Error fetching password:", error);
          toast.error("Failed to fetch password details");
        } finally {
          setIsLoading(false);
        }
      } else if (password.decryptedPassword) {
        form.setValue("password", password.decryptedPassword);
        // Set initial strength based on the password object
        setStrengthFromLabel(password.strength);
      }
    };

    fetchPassword();
  }, [password, open, form, toast]);

  // Helper to set strength from label
  const setStrengthFromLabel = (label: string) => {
    switch (label) {
      case "Strong":
        setPasswordStrength(4);
        break;
      case "Moderate":
        setPasswordStrength(3);
        break;
      case "Weak":
        setPasswordStrength(2);
        break;
      case "Vulnerable":
      default:
        setPasswordStrength(1);
        break;
    }
    setStrengthLabel(label);
  };

  // Update password strength when password changes
  const updatePasswordStrength = async (password: string) => {
    try {
      const response = await fetch("/api/passwords/strength", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Failed to check password strength");
      }

      const data = await response.json();
      setPasswordStrength(data.score || 0);
      setStrengthLabel(data.strength || "Vulnerable");
      form.setValue("strength", data.strength);
    } catch (error) {
      console.error("Error checking password strength:", error);
      // Fallback to basic strength check
      const score = password.length >= 12 ? 4 : password.length >= 8 ? 2 : 1;
      setPasswordStrength(score);
      setStrengthLabel(
        score >= 3 ? "Strong" : score >= 2 ? "Moderate" : "Weak"
      );
      form.setValue(
        "strength",
        score >= 3 ? "Strong" : score >= 2 ? "Moderate" : "Weak"
      );
    }
  };

  // Watch password field to update strength
  const watchPassword = form.watch("password");

  // Update strength when password changes
  useEffect(() => {
    if (watchPassword && !isLoading) {
      updatePasswordStrength(watchPassword);
    }
  }, [watchPassword, isLoading]);

  // Generate a random password
  // const handleGeneratePassword = () => {
  //   const newPassword = generatePassword(16, true, true, true, true)
  //   form.setValue("password", newPassword)
  //   updatePasswordStrength(newPassword)
  // }

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/passwords/${values.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update password:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength >= 4) return "bg-green-500";
    if (passwordStrength >= 3) return "bg-yellow-500";
    if (passwordStrength >= 2) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-fancy">
            Edit Password
          </DialogTitle>
          <DialogDescription>
            Update your password details. All passwords are encrypted.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-deepPurple" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...form.register("id")} />

              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://google.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username / Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updatePasswordStrength(e.target.value);
                          }}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      {/* Password generator */}
                      {/* <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleGeneratePassword}
                        title="Generate secure password"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button> */}
                    </div>

                    {/* Password strength meter */}
                    {watchPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="h-1.5 w-full bg-deepPurple/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStrengthColor()} transition-all duration-300`}
                            style={{
                              width: `${(passwordStrength / 4) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Strength:{" "}
                          <span
                            className={
                              passwordStrength >= 3
                                ? "text-green-500"
                                : passwordStrength >= 2
                                ? "text-yellow-500"
                                : "text-red-500"
                            }
                          >
                            {strengthLabel}
                          </span>
                        </p>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-deepPurple hover:bg-deepPurple/80"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
