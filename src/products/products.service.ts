import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductDocument } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @Inject(forwardRef(() => CartService)) private readonly cartService: CartService
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = new this.productModel(createProductDto);
        return product.save();
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec();
    }

    async findOne(id: string): Promise<Product | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return this.productModel.findById(id).exec();
    }

    async updateStock(id: string, delta: number): Promise<Product> {
        const product = await this.productModel.findById(id).exec();
        if (!product) throw new NotFoundException(`Product with id ${id} not found.`);

        const newStock = product.stock + delta;
        if (newStock < 0) {
            throw new BadRequestException(`Stock cannot be negative. Current stock: ${product.stock}`);
        }

        product.stock = newStock;
        await product.save();

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
        if (!Types.ObjectId.isValid(id)) throw new NotFoundException(`Invalid product id.`);

        const updated = await this.productModel
        .findByIdAndUpdate(id, updateProductDto, { new: true })
        .exec();

        if (!updated) throw new NotFoundException(`Product with id: ${id} not found.`);

        return updated;
    }

    async remove(id: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(id)) return false;

        await this.cartService.removeItemsByProductId(id);

        const result = await this.productModel.findByIdAndDelete(id).exec();
        return !!result;
    }
}
