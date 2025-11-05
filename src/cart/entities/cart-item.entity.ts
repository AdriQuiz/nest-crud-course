import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

export type CartItemDocument = CartItem & Document;
@Schema({ timestamps: true })
export class CartItem {
    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: number;

    @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
    productId: number;

    @Prop({ required: true })
    quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);