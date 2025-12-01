import Idea, { IIdea } from '../models/idea.model';

export const findIdeaById = async (ideaId: string): Promise<IIdea | null> => {
  return await Idea.findById(ideaId).populate('student');
};

export const findAllIdeas = async (): Promise<IIdea[]> => {
  return await Idea.find().populate('student');
};

export const findIdeasByQuery = async (query: any): Promise<IIdea[]> => {
  return await Idea.find(query).populate('student');
};

export const findIdeasByStudent = async (studentId: string): Promise<IIdea[]> => {
  return await Idea.find({ student: studentId }).populate('student');
};

export const createNewIdea = async (ideaData: Partial<IIdea>): Promise<IIdea> => {
  const newIdea = new Idea(ideaData);
  return await newIdea.save();
};

export const updateIdeaById = async (
  ideaId: string,
  updateData: Partial<IIdea>
): Promise<IIdea | null> => {
  return await Idea.findByIdAndUpdate(
    ideaId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('student');
};

export const deleteIdeaById = async (ideaId: string): Promise<IIdea | null> => {
  return await Idea.findByIdAndUpdate(
    ideaId,
    { $set: { isActive: false } },
    { new: true }
  );
};
