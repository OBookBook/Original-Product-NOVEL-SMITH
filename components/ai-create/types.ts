export interface AlertState {
  message: string;
  show: boolean;
  title: string;
  type: "error" | "success";
}

export interface ExamplePrompt {
  description: string;
  prompt: string;
  title: string;
}

export interface StoryPromptForm {
  prompt: string;
}
