<template>
  <button class="btn btn-success me-1" data-bs-target="#export-modal" data-bs-toggle="modal">
    <i class="bi bi-file-earmark-plus"></i> Export
  </button>
  <div class="modal fade" id="export-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Export Penjualan</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row text-start">
            <div class="col-12 mb-3">
              <label for="start_date" class="form-label">Tanggal Awal: </label>
              <input type="date" class="form-control" id="start_date" placeholder="Tanggal Awal" v-model="start_date" />
            </div>
            <div class="col-12 mb-3">
              <label for="end_date" class="form-label">Tanggal Akhir: </label>
              <input type="date" class="form-control" id="end_date" placeholder="Tanggal Akhir" v-model="end_date" />
            </div>
            <div class="col-6">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            </div>
            <div class="col-6 text-end">
              <button type="button" class="btn btn-success" @click="exportExcel" data-bs-dismiss="modal"
                :disabled="!meta.valid">Export</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import useApi from '../composables/api';
import Notify from '../helpers/notify';

const schema = yup.object().shape({
  start_date: yup.date().required(),
  end_date: yup.date().required(),
});

const { meta } = useForm({
  validationSchema: schema,
  initialValues: {
    start_date: '',
    end_date: '',
  },
});

const { value: start_date } = useField<Date>('start_date');
const { value: end_date } = useField<Date>('end_date');

const { getResource } = useApi();


const exportExcel = async () => {
  console.log(start_date.value);
  const response = await getResource('/detail-transaksi/export/' + start_date.value + '/' + end_date.value);
  if (response) {
    window.open(import.meta.env.VITE_API + '/' + response.data.url);
    Notify.success('Berhasil Export Data');
  }

};

</script>
