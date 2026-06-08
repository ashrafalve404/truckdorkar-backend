import { Controller, Post, Get, Body, Param, UseGuards, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { Role } from '@prisma/client';

@ApiTags('reviews')
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Submit a review for a completed booking' })
    create(@CurrentUser('id') userId: string, @Body() dto: CreateReviewDto) {
        return this.reviewsService.create(userId, dto);
    }

    @Get('driver/:userId')
    @ApiOperation({ summary: 'Get all reviews for a specific driver' })
    findForDriver(@Param('userId') driverUserId: string) {
        return this.reviewsService.findForDriver(driverUserId);
    }

    @Patch(':id/moderate')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: '[Admin] Show or hide a review' })
    moderate(@Param('id') id: string, @Body('isVisible') isVisible: boolean) {
        return this.reviewsService.moderate(id, isVisible);
    }
}
