<h2>Новая заявка</h2>

<table cellpadding="6" style="border-collapse: collapse;">
    <tr><td><strong>Зарубежный продукт:</strong></td><td>{{ $application->foreign_product_name }}</td></tr>
    <tr><td><strong>Телефон:</strong></td><td>{{ $application->phone_number }}</td></tr>
    <tr><td><strong>ФИО:</strong></td><td>{{ $application->full_name ?? '—' }}</td></tr>
    <tr><td><strong>Замена:</strong></td><td>{{ $application->partner_replacement ?? '—' }}</td></tr>
</table>