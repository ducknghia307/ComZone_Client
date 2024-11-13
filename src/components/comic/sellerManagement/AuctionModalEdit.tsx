import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { Form, InputNumber, DatePicker, Modal } from 'antd';
import dayjs from 'dayjs';
import { privateAxios } from '../../../middleware/axiosInstance';
import { Auction, Comic } from '../../../common/base.interface';
import { RuleObject } from 'antd/lib/form';

const AuctionModalEdit = ({ open, onCancel, comic, auctionData, onSuccess }: { open: boolean; onCancel: () => void; comic: Comic; auctionData: Auction; onSuccess: (updatedAuctionData: Auction) => void; }) => {
    const [form] = Form.useForm();
    const now = dayjs();
    useEffect(() => {
        if (auctionData) {
            form.setFieldsValue({
                reservePrice: auctionData.reservePrice,
                maxPrice: auctionData.maxPrice,
                priceStep: auctionData.priceStep,
                startTime: dayjs(auctionData.startTime),
                endTime: dayjs(auctionData.endTime),
            });
        }
    }, [auctionData, form]);

    const validateEndTime = (rule: RuleObject, value: dayjs.Dayjs) => {
        const startTime = form.getFieldValue("startTime");
        if (!startTime || !value) return Promise.resolve();

        if (dayjs(value).isBefore(dayjs(startTime))) {
            return Promise.reject("Thời gian kết thúc phải sau thời gian bắt đầu");
        }

        if (dayjs(value).isAfter(dayjs(startTime).add(7, "days"))) {
            return Promise.reject("Thời gian kết thúc không được vượt quá 7 ngày kể từ thời gian bắt đầu");
        }
        return Promise.resolve();
    };

    const disabledDate = (current: dayjs.Dayjs | null): boolean => {
        return current ? current < now.startOf('day') : false;
    };


    // Disable past times if today is selected
    const disabledTime = (current: dayjs.Dayjs | null) => {
        if (current && current.isSame(now, 'day')) {
            return {
                disabledHours: () => [...Array(now.hour()).keys()],
                disabledMinutes: () => [...Array(now.minute()).keys()],
            };
        }
        return {};
    };

    const handleSubmit = async (values: { reservePrice: number; maxPrice: number; priceStep: number; startTime: string; endTime: string }) => {
        try {
            const updatedAuctionData: Auction = {
                ...auctionData,
                id: auctionData.id,
                reservePrice: values.reservePrice,
                maxPrice: values.maxPrice,
                priceStep: values.priceStep,
                startTime: dayjs(values.startTime).format('YYYY-MM-DDTHH:mm:ssZ'),
                endTime: dayjs(values.endTime).format('YYYY-MM-DDTHH:mm:ssZ'),
            };

            await privateAxios.put(`/auction/${auctionData.id}`, updatedAuctionData);

            console.log("update", updatedAuctionData);
            onSuccess(updatedAuctionData);
            onCancel();
        } catch (error) {
            console.error("Error updating auction details:", error);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            destroyOnClose={true}
            width={700}
            style={{ borderRadius: '16px' }}
            centered
        >
            <Box sx={{ px: 3, py: 1 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                        Chi tiết cuộc đấu giá
                    </Typography>
                    {/* <Box sx={{
                        mt: 1,
                        height: '1px',
                        width: 'auto',
                        bgcolor: '#ccc',
                        mx: 'auto',
                        borderRadius: '2px'
                    }} /> */}
                </Box>

                {/* Comic Info */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 3,
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 2
                }}>
                    <Box sx={{
                        width: 80,
                        height: 112,
                        flexShrink: 0,
                        borderRadius: 1,
                        overflow: 'hidden',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <img
                            src={comic?.coverImage}
                            alt="Comic Cover"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {comic?.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {comic?.author}
                        </Typography>
                    </Box>
                </Box>

                {/* Form */}
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    style={{ marginTop: '16px' }}
                >
                    {/* Price Fields */}
                    <Form.Item
                        name="reservePrice"
                        label={
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                Giá khởi điểm (đ)
                            </Typography>
                        }
                        rules={[{ required: true, message: "Vui lòng nhập giá khởi điểm" }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Nhập giá khởi điểm"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="maxPrice"
                        label={
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                Giá tối đa (đ)
                            </Typography>
                        }
                        rules={[{ required: true, message: "Vui lòng nhập giá tối đa" }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Nhập giá tối đa"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="priceStep"
                        label={
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                Bước giá (đ)
                            </Typography>
                        }
                        rules={[{ required: true, message: "Vui lòng nhập bước giá" }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Nhập bước giá"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>

                    {/* Date Fields */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Form.Item
                            name="startTime"
                            label={<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>Thời gian bắt đầu</Typography>}
                            rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu" }]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: '100%' }}
                                placeholder="Chọn thời gian bắt đầu"
                                disabledDate={disabledDate}
                                disabledTime={disabledTime}
                                onChange={() => {
                                    // Trigger re-validation of endTime when startTime changes
                                    form.validateFields(["endTime"]);
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="endTime"
                            label={<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>Thời gian kết thúc</Typography>}
                            rules={[
                                { required: true, message: "Vui lòng chọn thời gian kết thúc" },
                                { validator: validateEndTime }
                            ]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: '100%' }}
                                placeholder="Chọn thời gian kết thúc"
                            />
                        </Form.Item>
                    </Box>

                    {/* Submit Button */}
                    <Form.Item style={{ marginTop: '10px' }}>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#000',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000'}
                        >
                            Mở Lại Phiên Đấu Giá
                        </button>
                    </Form.Item>
                </Form>
            </Box>
        </Modal>
    );
};

export default AuctionModalEdit;