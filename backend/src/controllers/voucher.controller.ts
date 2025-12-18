import { Request, Response } from 'express';
import * as voucherService from '../services/voucher.service';
import * as userRepository from '../repositories/user.repository';
import * as teacherRepository from '../repositories/teacher.repository'; // 1. הוספנו את ה-Repository של המורה

export const getVoucherById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const voucher = await voucherService.getVoucherById(id);
    res.status(200).json(voucher);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllVouchers = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. הגנה: בדיקה שיש משתמש מחובר
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // 2. אדמין - מקבל הכל
    if (req.user.role === 'admin') {
      const vouchers = await voucherService.getAllVouchers();
      res.status(200).json(vouchers);
      return;
    }

    // 3. מורה - מקבל רק של התלמידים שלו
    if (req.user.role === 'teacher') {
      // תיקון: משתמשים ב-teacherRepository כדי לקבל אובייקט מסוג ITeacher עם תלמידים
      const teacher = await teacherRepository.findTeacherById(req.user.userId);
      
      if (!teacher) {
        res.status(404).json({ message: 'Teacher not found' });
        return;
      }

      // בגלל שעשינו populate, התלמידים הם אובייקטים. אנחנו צריכים את ה-ID שלהם.
      // אנו בודקים אם student הוא אובייקט (עם _id) או מחרוזת
      const studentIds = (teacher.students || []).map((s: any) => 
        s._id ? s._id.toString() : s.toString()
      );

      // איסוף כל השוברים של כל התלמידים
      // (הערה: בביצועים גבוהים עדיף לעשות את זה בשאילתה אחת ב-Service עם $in, אבל זה יעבוד כרגע)
      const results: any[] = [];
      for (const sid of studentIds) {
        const vs = await voucherService.getVouchersByStudent(sid);
        results.push(...vs);
      }

      res.status(200).json(results);
      return;
    }

    // כל תפקיד אחר (למשל תלמיד שמנסה לראות הכל) - חסום
    res.status(403).json({ message: 'Forbidden' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getVouchersByStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Admin can access any student
    if (req.user.role === 'admin') {
      const vouchers = await voucherService.getVouchersByStudent(studentId);
      res.status(200).json(vouchers);
      return;
    }

    // Teacher: only if student belongs to teacher
    if (req.user.role === 'teacher') {
      // תיקון: גם כאן משתמשים ב-teacherRepository
      const teacher = await teacherRepository.findTeacherById(req.user.userId);
      
      if (!teacher) {
        res.status(404).json({ message: 'Teacher not found' });
        return;
      }

      // מיפוי ה-IDs
      const studentIds = (teacher.students || []).map((s: any) => 
        s._id ? s._id.toString() : s.toString()
      );

      // בדיקה אם התלמיד המבוקש נמצא ברשימה של המורה
      if (!studentIds.includes(studentId)) {
        res.status(403).json({ message: 'Forbidden: This student does not belong to you' });
        return;
      }

      const vouchers = await voucherService.getVouchersByStudent(studentId);
      res.status(200).json(vouchers);
      return;
    }

    // אם זה תלמיד שמנסה לראות תלמיד אחר (או את עצמו דרך הנתיב הזה)
    // אם רוצים לאפשר לתלמיד לראות את עצמו:
    if (req.user.role === 'student' && req.user.userId === studentId) {
         const vouchers = await voucherService.getVouchersByStudent(studentId);
         res.status(200).json(vouchers);
         return;
    }

    res.status(403).json({ message: 'Forbidden' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// ... שאר הפונקציות נשארות זהות (getMyVouchers, וכו') ...
export const getMyVouchers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const vouchers = await voucherService.getVouchersByStudent(req.user.userId);
    res.status(200).json(vouchers);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUnredeemedVouchersByStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const vouchers = await voucherService.getUnredeemedVouchersByStudent(studentId);
    res.status(200).json(vouchers);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyUnredeemedVouchers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const vouchers = await voucherService.getUnredeemedVouchersByStudent(req.user.userId);
    res.status(200).json(vouchers);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getVouchersByIssuedBy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacherId } = req.params;
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (req.user.role === 'admin') {
      const vouchers = await voucherService.getVouchersByIssuedBy(teacherId);
      res.status(200).json(vouchers);
      return;
    }

    if (req.user.role === 'teacher') {
      if (req.user.userId !== teacherId) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }
      const vouchers = await voucherService.getVouchersByIssuedBy(teacherId);
      res.status(200).json(vouchers);
      return;
    }

    res.status(403).json({ message: 'Forbidden' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const issueVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const { student } = req.body;
    if (!student) {
      res.status(400).json({ message: 'Student ID is required' });
      return;
    }
    const voucherData = {
      student,
      issuedBy: req.user.userId,
    };
    const newVoucher = await voucherService.issueVoucher(voucherData);
    res.status(201).json(newVoucher);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedVoucher = await voucherService.deleteVoucher(id);
    res.status(200).json({ message: 'Voucher deleted successfully', voucher: deletedVoucher });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const approveVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const approved = await voucherService.approveVoucher(id, req.user.userId);
    res.status(200).json(approved);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const { id } = req.params;
    const rejected = await voucherService.rejectVoucher(id, req.user.userId);
    res.status(200).json(rejected);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};