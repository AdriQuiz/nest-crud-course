import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type ProductDocument = Product & Document;
@Schema({ timestamps: true })
export class Product {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product); 