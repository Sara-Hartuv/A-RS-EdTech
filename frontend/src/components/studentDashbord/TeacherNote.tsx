import { MessageSquare} from 'lucide-react';

type Props = { comment: string };

export default function TeacherNote({ comment }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center">
          <MessageSquare className="text-orange-600 w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg text-slate-800">הערה מהמורה:</h3>
      </div>
      <p className="text-slate-700 leading-relaxed text-base" style={{ fontFamily: 'Arial, sans-serif' }}>
        {comment}
      </p>
    </div>
  );
}
