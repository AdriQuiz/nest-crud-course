import { Injectable, NotFoundException } from '@nestjs/common';
import { CartItem, CartItemDocument } from './entities/cart-item.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
        private readonly usersService: UsersService,
        private readonly productsService: ProductsService,
    ) {}

    async create(addCartItemDto: AddCartItemDto): Promise<CartItem> {
        const { userId, productId, quantity } = addCartItemDto;

        const user = await this.usersService.findOne(userId);
        if (!user) throw new NotFoundException(`User with id: ${userId} not found.`);

        const product = await this.productsService.findOne(productId);
        if (!product) throw new NotFoundException(`Product with id: ${productId} not found.`);

        const existing = await this.cartItemModel.findOne({ userId, productId }).exec();

        if (existing) {
            existing.quantity += quantity;
            return existing.save();
        }

        const newItem = new this.cartItemModel({
            userId,
            productId,
            quantity
        });

        return newItem.save();
    }

    async findAll(userId: string): Promise<CartItem[]> {
        return this.cartItemModel.find({ userId }).populate('productId').exec();
    }

    async updateQuantity(id: string, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
        if (!Types.ObjectId.isValid(id)) throw new NotFoundException(`Invalid item id.`);

        const updatedItem = await this.cartItemModel
            .findByIdAndUpdate(id, { quantity: updateCartItemDto.quantity }, { new: true })
            .exec();
        
        if (!updatedItem) throw new NotFoundException(`Item with id: ${id} not found in your cart.`);

        return updatedItem;
    }

    async removeItem(id: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(id)) return false;

        const result = await this.cartItemModel.findByIdAndDelete(id).exec();
        return !!result;
    }
}
