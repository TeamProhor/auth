import { toast as baseToast } from "@/components/ui/toast";

export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "সফলভাবে লগইন করা হয়েছে",
    LOGIN_FAILED: "লগইন ব্যর্থ হয়েছে",
    LOGOUT_SUCCESS: "সফলভাবে লগআউট করা হয়েছে",
    REGISTER_SUCCESS: "অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে",
    MAGIC_LINK_SENT: "ইমেইলে ম্যাজিক লিংক পাঠানো হয়েছে",
    TWO_FACTOR_REQUIRED: "২FA কোড আবশ্যক",
    INVALID_CREDENTIALS: "ইমেইল বা পাসওয়ার্ড ভুল",
  },
  SECURITY: {
    PASSWORD_CHANGE_LOADING: "পাসওয়ার্ড পরিবর্তন করা হচ্ছে...",
    PASSWORD_CHANGE_SUCCESS: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে",
    PASSWORD_CHANGE_ERROR: "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে",
    UNLINK_LOADING: "অ্যাকাউন্ট বিচ্ছিন্ন করা হচ্ছে...",
    UNLINK_SUCCESS: "সংযুক্ত অ্যাকাউন্ট সফলভাবে বিচ্ছিন্ন করা হয়েছে",
    UNLINK_ERROR: "অ্যাকাউন্ট বিচ্ছিন্ন করতে ব্যর্থ হয়েছে",
    LINK_SUCCESS_GITHUB: "GitHub অ্যাকাউন্ট সফলভাবে সংযুক্ত করা হয়েছে",
    LINK_SUCCESS_GOOGLE: "Google অ্যাকাউন্ট সফলভাবে সংযুক্ত করা হয়েছে",
    LINK_ERROR_STATE: "লিংক অনুরোধের মেয়াদ শেষ হয়েছে বা ইতিমধ্যে ব্যবহার করা হয়েছে",
    LINK_ERROR_TAKEN: "এই অ্যাকাউন্টটি ইতিমধ্যে অন্য একটি Prohor অ্যাকাউন্টে সংযুক্ত আছে",
    SESSION_REVOKED: "সেশন সফলভাবে বাতিল করা হয়েছে",
    ALL_SESSIONS_REVOKED: "সকল ডিভাইস থেকে লগআউট করা হয়েছে",
    TWO_FACTOR_ENABLED: "২FA সফলভাবে চালু করা হয়েছে",
    TWO_FACTOR_DISABLED: "২FA নিষ্ক্রিয় করা হয়েছে",
  },
  DEVELOPER: {
    APP_CREATED: "নতুন OAuth অ্যাপ তৈরি করা হয়েছে",
    APP_UPDATED: "OAuth অ্যাপ আপডেট করা হয়েছে",
    APP_DELETED: "OAuth অ্যাপ মুছে ফেলা হয়েছে",
    USER_BANNED: "ব্যবহারকারীকে স্থগিত করা হয়েছে",
    USER_UNBANNED: "ব্যবহারকারীর স্থগিতাদেশ তুলে নেওয়া হয়েছে",
  },
  COMMON: {
    SOMETHING_WENT_WRONG: "একটি ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।",
    COPIED_TO_CLIPBOARD: "ক্লিপবোর্ডে কপি করা হয়েছে",
  },
} as const;

/**
 * Enhanced toast helper around Base-UI Toast Manager (@/components/ui/toast)
 */
export const showToast = {
  success: (title: string, description?: string) => {
    baseToast.add({
      title,
      description,
      type: "success",
    });
  },

  error: (title: string, description?: string) => {
    baseToast.add({
      title,
      description,
      type: "error",
    });
  },

  info: (title: string, description?: string) => {
    baseToast.add({
      title,
      description,
      type: "info",
    });
  },

  warning: (title: string, description?: string) => {
    baseToast.add({
      title,
      description,
      type: "warning",
    });
  },

  /**
   * Helper for promises with toast lifecycle feedback
   */
  promise: async <T>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    },
  ): Promise<T> => {
    const loadingToastId = baseToast.add({
      title: msgs.loading,
      type: "loading",
    });

    try {
      const data = await promise;
      baseToast.close(loadingToastId);
      const successTitle =
        typeof msgs.success === "function" ? msgs.success(data) : msgs.success;
      baseToast.add({
        title: successTitle,
        type: "success",
      });
      return data;
    } catch (err) {
      baseToast.close(loadingToastId);
      const errorTitle =
        typeof msgs.error === "function" ? msgs.error(err) : msgs.error;
      baseToast.add({
        title: errorTitle,
        type: "error",
      });
      throw err;
    }
  },
};
