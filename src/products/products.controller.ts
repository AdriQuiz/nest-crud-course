import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    async findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const product = await this.productsService.findOne(id);

        if (product === null) {
            throw new NotFoundException(`Product with id: ${id} was not found.`);
        }
        return product;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        const product = await this.productsService.update(id, updateProductDto);

        if (product === null) {
            throw new NotFoundException(`Product with id: ${id} was not found.`);
        }
        return product;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const value = await this.productsService.remove(id);

        if (!value) {
            throw new NotFoundException(`Product with id: ${id} was not found.`);
        }
        return { message: `User with id: ${id} was deleted successfully.` };
    }
}
