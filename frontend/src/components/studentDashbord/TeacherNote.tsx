import { MessageSquare, Heart } from 'lucide-react';

type Props = { comment: string };

export default function TeacherNote({ comment }: Props) {
  if (!comment) return null;
  
  return (
    <div className="relative">
      {/* Speech bubble style */}
      <div className="bg-white rounded-[2rem] p-6 shadow-lg border-2 border-accent-100 relative">
        {/* Decorative corner */}
        <div className="absolute -top-3 right-8 w-6 h-6 bg-white border-t-2 border-r-2 border-accent-100 transform rotate-[-45deg]" />
        
        <div className="flex items-start gap-4">
          {/* Avatar circle */}
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-neutral-800">הודעה מהמורה</h3>
              <Heart className="w-4 h-4 text-accent-400 fill-accent-400" />
            </div>
            <p className="text-neutral-600 leading-relaxed text-base">
              {comment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
