package com.haeseong.receipt_app.service.receipt;

import com.haeseong.receipt_app.domain.Receipt;
import com.haeseong.receipt_app.repository.ReceiptRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xddf.usermodel.XDDFColor;
import org.apache.poi.xddf.usermodel.XDDFSolidFillProperties;
import org.apache.poi.xddf.usermodel.chart.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReceiptExcelService {

    private final ReceiptRepository receiptRepository;

    public ByteArrayInputStream createYearExcel(Long userId, int year) throws Exception {

        List<Receipt> list =
                receiptRepository.findByUser_UserIdAndTransactionDateYear(userId, year);

        XSSFWorkbook wb = new XSSFWorkbook();

        CellStyle title = title(wb);
        CellStyle header = header(wb);
        CellStyle body = body(wb);
        CellStyle money = money(wb);
        CellStyle total = totalMoney(wb);

        Map<Integer, List<Receipt>> monthMap =
                list.stream()
                        .filter(r -> r.getTransactionDate() != null) // 🔥 NPE 방지
                        .collect(Collectors.groupingBy(r -> r.getTransactionDate().getMonthValue()));

        // =========================
        // SUMMARY
        // =========================
        XSSFSheet s = wb.createSheet("SUMMARY");

        Row tr = s.createRow(0);
        create(tr,0,year+"年 支出レポート",title);
        s.addMergedRegion(new CellRangeAddress(0,0,0,9));

        List<String> months = new ArrayList<>();
        List<Long> values = new ArrayList<>();

        Row h = s.createRow(2);
        String[] hh = {"月","合計金額","最大支出日"};
        for(int i=0;i<3;i++){
            create(h,7+i,hh[i],header);
        }

        int rowIdx = 3;
        long sum = 0;

        for(int m=1;m<=12;m++){
            List<Receipt> ml = monthMap.getOrDefault(m,new ArrayList<>());

            long tot = ml.stream()
                    .filter(r -> r.getTotalAmount() != null)
                    .mapToLong(Receipt::getTotalAmount)
                    .sum();

            sum += tot;

            months.add(m+"月");
            values.add(tot);

            String maxDay = ml.stream()
                    .filter(r -> r.getTransactionDate() != null)
                    .collect(Collectors.groupingBy(
                            Receipt::getTransactionDate,
                            Collectors.summingLong(r -> Optional.ofNullable(r.getTotalAmount()).orElse(0L))
                    ))
                    .entrySet()
                    .stream()
                    .max(Map.Entry.comparingByValue())
                    .map(e->e.getKey().toString())
                    .orElse("-");

            Row r = s.createRow(rowIdx++);

            create(r,7,m+"月",body);

            Cell mc = r.createCell(8);
            mc.setCellValue(tot);
            mc.setCellStyle(money);

            create(r,9,maxDay,body);
        }

        Row totalRow = s.createRow(rowIdx+1);
        create(totalRow,7,"合計",header);

        Cell tc = totalRow.createCell(8);
        tc.setCellValue(sum);
        tc.setCellStyle(total);

        //  너비 (핵심 조정)
        s.setColumnWidth(0,3500);
        s.setColumnWidth(1,3500);
        s.setColumnWidth(2,3500);
        s.setColumnWidth(3,3500);
        s.setColumnWidth(7,3500);
        s.setColumnWidth(8,7000);
        s.setColumnWidth(9,6000);

        // =========================
        // SUMMARY 차트 (작게 + 안겹치게)
        // =========================
        XSSFDrawing d = s.createDrawingPatriarch();

        XSSFChart chart = d.createChart(
                d.createAnchor(0,0,0,0,0,2,4,25)
        );

        chart.setTitleText("月別支出");

        XDDFCategoryAxis x = chart.createCategoryAxis(AxisPosition.BOTTOM);
        XDDFValueAxis y = chart.createValueAxis(AxisPosition.LEFT);

        XDDFDataSource<String> xs =
                XDDFDataSourcesFactory.fromArray(months.toArray(new String[0]));

        XDDFNumericalDataSource<Double> ys =
                XDDFDataSourcesFactory.fromArray(
                        values.stream().map(v -> v == null ? 0.0 : v.doubleValue()).toArray(Double[]::new)
                );

        XDDFBarChartData data = (XDDFBarChartData)
                chart.createData(ChartTypes.BAR,x,y);

        XDDFBarChartData.Series series =
                (XDDFBarChartData.Series) data.addSeries(xs,ys);

        series.setTitle("支出",null);

        series.setFillProperties(
                new XDDFSolidFillProperties(
                        XDDFColor.from(new byte[]{59,(byte)130,(byte)246})
                )
        );

        chart.plot(data);

        // =========================
        // 월별 시트
        // =========================
        for(int m=1;m<=12;m++){

            XSSFSheet sh = wb.createSheet(m+"月");
            List<Receipt> ml = monthMap.getOrDefault(m,new ArrayList<>());

            Row t = sh.createRow(0);
            create(t,0,year+"年 "+m+"月 支出",title);
            sh.addMergedRegion(new CellRangeAddress(0,0,0,5));

            long tot = ml.stream()
                    .filter(r -> r.getTotalAmount() != null)
                    .mapToLong(Receipt::getTotalAmount)
                    .sum();

            create(t,6,"合計",header);

            Cell tv = t.createCell(7);
            tv.setCellValue(tot);
            tv.setCellStyle(total);

            Row hd = sh.createRow(2);
            String[] cols = {"日付","店舗名","カテゴリ","金額","通貨","数量"};
            for(int i=0;i<6;i++){
                create(hd,i,cols[i],header);
            }

            int rIdx = 3;

            for(Receipt rec: ml){
                Row row = sh.createRow(rIdx++);

                create(row,0,
                        rec.getTransactionDate()==null?"-":rec.getTransactionDate().toString(),
                        body);

                create(row,1,
                        rec.getStoreName()==null?"-":rec.getStoreName(),
                        body);

                create(row,2,
                        rec.getCategory()==null?"-":rec.getCategory(),
                        body);

                Cell mc = row.createCell(3);
                mc.setCellValue(Optional.ofNullable(rec.getTotalAmount()).orElse(0L));
                mc.setCellStyle(money);

                create(row,4,
                        rec.getCurrency()==null?"-":rec.getCurrency(),
                        body);

                create(row,5,
                        rec.getItemCount()==null?"0":rec.getItemCount().toString(),
                        body);
            }

            // =========================
            // 일별 차트 (아래 배치 - 겹침 방지)
            // =========================
            Map<LocalDate, Long> daily =
                    ml.stream()
                            .filter(r -> r.getTransactionDate()!=null)
                            .collect(Collectors.groupingBy(
                                    Receipt::getTransactionDate,
                                    Collectors.summingLong(r -> Optional.ofNullable(r.getTotalAmount()).orElse(0L))
                            ));

            List<LocalDate> keys = daily.keySet().stream()
                    .sorted()
                    .collect(Collectors.toList());

            List<String> days = keys.stream()
                    .map(LocalDate::toString)
                    .collect(Collectors.toList());

            List<Long> vals = keys.stream()
                    .map(k -> daily.getOrDefault(k, 0L))
                    .collect(Collectors.toList());

            XSSFDrawing dd = sh.createDrawingPatriarch();

            XSSFChart c = dd.createChart(
                    dd.createAnchor(0,0,0,0,0,rIdx+2,6,rIdx+15) // 🔥 아래로 배치
            );

            c.setTitleText("日別支出");

            XDDFCategoryAxis cx = c.createCategoryAxis(AxisPosition.BOTTOM);
            XDDFValueAxis cy = c.createValueAxis(AxisPosition.LEFT);

            XDDFDataSource<String> dx =
                    XDDFDataSourcesFactory.fromArray(days.toArray(new String[0]));

            XDDFNumericalDataSource<Double> dy =
                    XDDFDataSourcesFactory.fromArray(
                            vals.stream().map(v -> v==null?0.0:v.doubleValue()).toArray(Double[]::new)
                    );

            XDDFBarChartData cd =
                    (XDDFBarChartData) c.createData(ChartTypes.BAR,cx,cy);

            XDDFBarChartData.Series srs =
                    (XDDFBarChartData.Series) cd.addSeries(dx,dy);

            srs.setTitle("日別",null);

            srs.setFillProperties(
                    new XDDFSolidFillProperties(
                            XDDFColor.from(new byte[]{34,(byte)197,94})
                    )
            );

            c.plot(cd);

            // 너비 확대
            sh.setColumnWidth(0,4500);
            sh.setColumnWidth(1,9000);
            sh.setColumnWidth(2,5000);
            sh.setColumnWidth(3,6500);
            sh.setColumnWidth(4,3500);
            sh.setColumnWidth(5,3500);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        wb.write(out);
        wb.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void create(Row r,int i,String v,CellStyle s){
        Cell c = r.createCell(i);
        c.setCellValue(v);
        c.setCellStyle(s);
    }

    private CellStyle title(Workbook wb){
        Font f = wb.createFont();
        f.setBold(true);
        f.setFontHeightInPoints((short)20);

        CellStyle s = wb.createCellStyle();
        s.setFont(f);
        return s;
    }

    private CellStyle header(Workbook wb){
        Font f = wb.createFont();
        f.setBold(true);
        f.setColor(IndexedColors.WHITE.getIndex());

        CellStyle s = wb.createCellStyle();
        s.setFont(f);
        s.setAlignment(HorizontalAlignment.CENTER);

        s.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        border(s);
        return s;
    }

    private CellStyle body(Workbook wb){
        CellStyle s = wb.createCellStyle();
        border(s);
        return s;
    }

    private CellStyle money(Workbook wb){
        CellStyle s = wb.createCellStyle();
        DataFormat f = wb.createDataFormat();
        s.setDataFormat(f.getFormat("#,##0"));
        s.setAlignment(HorizontalAlignment.RIGHT);
        border(s);
        return s;
    }

    private CellStyle totalMoney(Workbook wb){
        Font f = wb.createFont();
        f.setBold(true);
        f.setColor(IndexedColors.RED.getIndex());

        CellStyle s = wb.createCellStyle();
        s.setFont(f);

        DataFormat df = wb.createDataFormat();
        s.setDataFormat(df.getFormat("#,##0"));

        s.setAlignment(HorizontalAlignment.RIGHT);
        border(s);
        return s;
    }

    private void border(CellStyle s){
        s.setBorderTop(BorderStyle.THIN);
        s.setBorderBottom(BorderStyle.THIN);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
    }
}