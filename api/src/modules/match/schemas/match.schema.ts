
import { MatchUser } from "./match-user.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { User } from "../../user/schemas/user.schema";

@Schema({timestamps: true})
export class Match {
    _id: Types.ObjectId;
    @Prop([{type: MatchUser, minlength: 2, maxlength: 2}])
    users: MatchUser[];
    @Prop()
    status: string;

    createdAt: Date;

    updatedAt: Date;
}

export type MatchDocument = HydratedDocument<Match>

export const matchSchema = SchemaFactory.createForClass(Match)