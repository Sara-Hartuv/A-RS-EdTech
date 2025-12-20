import { MessageSquare, User } from 'lucide-react';

type Props = { comment: string };

export default function TeacherNote({ comment }: Props) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow">
        <User className="text-indigo-600" />
      </div>
      <div className="bg-white p-3 rounded-lg shadow max-w-xl">
        <div className="flex items-center gap-2 text-slate-700">
          <MessageSquare className="text-slate-400" />
          <span className="font-medium">הודעת המורה</span>
        </div>
        <p className="mt-2 text-slate-800">{comment}</p>
      </div>
    </div>
  );
}
