<table>
    <thead>
        <tr>
            <th colspan="2"><strong>Laporan Transaksi {{ $month }} - {{ $year }}</strong></th>
        </tr>
        <tr>
            <th colspan="2"></th>
        </tr>
        <tr>
            <th>Tanggal</th>
            <th>Pemasukan</th>
        </tr>
    </thead>
    <tbody>
        @foreach($transaction as $row)
            <tr>
                <td>{{ $row['date'] }}</td>
                <td>Rp {{ number_format($row['total']) }}</td>
            </tr>
        @endforeach
    </tbody>
</table>