import mongoose from 'mongoose'

export function convertToObjectId(
    id?: string | number | mongoose.Types.ObjectId,
): mongoose.Types.ObjectId {
    if (!id) return new mongoose.Types.ObjectId()
    return new mongoose.Types.ObjectId(id)
}
