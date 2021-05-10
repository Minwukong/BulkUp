import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export const checkUser = async (ctx: any, next: any) => {
    const { user } = ctx.state;
};
