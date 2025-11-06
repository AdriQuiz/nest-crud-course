import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
        @Inject(forwardRef(() => ProductsService))
        private readonly productsService: ProductsService,
    ) { }

    async create(addCartItemDto: AddCartItemDto): Promise<CartItem> {
        const { userId, productId, quantity = 1 } = addCartItemDto;

        const user = await this.usersService.findOne(userId);
        if (!user) throw new NotFoundException(`User with id: ${userId} not found.`);

        const product = await this.productsService.findOne(productId);
        if (!product) throw new NotFoundException(`Product with id: ${productId} not found.`);

        const existing = await this.cartItemModel.findOne({ userId, productId }).exec();

        if (existing) {
            if (product.stock < existing.quantity + quantity) {
                throw new BadRequestException(`Only ${product.stock} units available.`);
            }
            existing.quantity += quantity;
            await this.productsService.updateStock(product._id.toString(), -quantity);

            return existing.save();
        }

        if (product.stock < quantity) {
            throw new BadRequestException(`Not enough stock.`);
        }

        await this.productsService.updateStock(product._id.toString(), -quantity);

        const newItem = new this.cartItemModel({
            userId,
            productId,
            quantity
        });

        return newItem.save();
    }

    async findAll(userId: string): Promise<CartItem[]> {
        return this.cartItemModel
            .find({ userId })
            .populate('productId', 'name price')
            .exec();
    }

    async removeItemsByProductId(productId: string): Promise<number> {
        const result = await this.cartItemModel.deleteMany({ productId }).exec();
        return result.deletedCount;
    }

    async updateQuantity(id: string, updateCartItemDto: UpdateCartItemDto): Promise<CartItem | null> {
        const { quantity } = updateCartItemDto;

        if (!Types.ObjectId.isValid(id)) throw new NotFoundException(`Invalid item id.`);

        const item = await this.cartItemModel.findById(id).populate('productId').exec();

        if (!item) {
            throw new NotFoundException(`Item with id: ${id} not found in your cart.`);
        }

        const product = item.productId as any;
        const delta = quantity - item.quantity;

        if (quantity === 0) {
            await this.productsService.updateStock(product._id, item.quantity);
            await this.cartItemModel.findByIdAndDelete(id).exec();
            return null;
        }

        if (quantity < 0) {
            throw new BadRequestException(`Quantity must be negative.`);
        }

        if (product.stock < delta) {
            throw new BadRequestException(`Only ${product.stock} units available for this product.`);
        }

        item.quantity = quantity;
        await this.productsService.updateStock(product._id, -delta);
        return item.save();
    }

    async removeItem(id: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(id)) return false;

        const item = await this.cartItemModel.findById(id).populate('productId').exec();
        if (!item) {
            throw new NotFoundException(`Item with id: ${id} not found in your cart.`);
        }

        const product = item.productId as any;
        await this.productsService.updateStock(product._id, item.quantity);

        const result = await this.cartItemModel.findByIdAndDelete(id).exec();
        return !!result;
    }
}
