<template>
  <div class="container">
    <div class="row">
      <div class="col-12 mt-5">
        <h1 class="text-center">SIMAMART</h1>
      </div>
    </div>
    <div class="row mt-5 justify-content-center mb-2">
      <div class="col-md-6 text-center col-8 mb-2">
        <div class="input-group rounded text-center">
          <input type="text" class="form-control" placeholder="Cari Barang" aria-label="Search"
            aria-describedby="search-addon" v-model="query" @change="handleSearch" />

          <button class="btn btn-secondary" id="search-addon" @click="handleSearch">
            <i class="bi bi-search"></i>
          </button>

        </div>
      </div>
      <div class="col-8 col-md-6 text-end mb-2">
        <RouterLink to="/transaksi" class="btn btn-info me-1">
          <i class="bi bi-cart"></i> Transaksi
        </RouterLink>
        <Export />
        <button class="btn btn-danger d-lg-none" id="search-addon" data-bs-target="#dinamyc-modal" data-bs-toggle="modal" @click="clearData">
          <i class="bi bi-plus-circle"></i>
        </button>
        <button class="btn btn-primary my-2 d-none d-lg-inline-block" id="btn-modal" data-bs-target="#dinamyc-modal" data-bs-toggle="modal" @click="clearData">
          <i class="bi bi-plus-circle"></i> Tambah
        </button>
        <Modal title="Tambah Barang">
          <div class="row text-start">
            <div class="col-12 mb-3">
              <label for="name" class="form-label">Nama Barang: </label>
              <input type="text" class="form-control" id="name" placeholder="Nama Barang" v-model="name"/>
            </div>
            <div class="col-12 mb-3">
              <label for="price" class="form-label">Harga Beli: </label>
              <input type="text" class="form-control" id="price" placeholder="Harga Beli" v-model="harga_beli" @keyup="convertRupiah(harga_beli)"/>
            </div>
            <div class="col-12 mb-3">
              <label for="harga-jual" class="form-label">Harga Jual: </label>
              <input type="text" class="form-control" id="harga-jual" placeholder="Harga Jual" v-model="harga_jual" @keyup="convertRupiah(harga_jual)"/>
            </div>
            <div class="col-12 mb-3">
              <label for="stok" class="form-label">Stok: </label>
              <input type="text" class="form-control" id="stok" placeholder="Harga Beli" v-model="stok"/>
            </div>
            <div class="col-6">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            </div>
            <div class="col-6 text-end">
              <button type="submit" class="btn btn-success" :disabled="!meta.valid" @click="save" data-bs-dismiss="modal">Simpan</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
    <div class="col-12">
      <div class="table-responsive">
        <table class="table table-hover table-bordered table-striped">
          <thead class="align-middle">
            <tr>
              <th class="text-center" rowspan="2">No</th>
              <th rowspan="2">Nama Barang</th>
              <th class="text-center" rowspan="2">Stok</th>
              <th colspan="2" class="text-center">Harga</th>
              <th colspan="2" class="text-center">Aksi</th>
            </tr>
            <tr>
              <th class="text-end">Harga Beli</th>
              <th class="text-end">Harga Jual</th>
              <th class="text-center">
                Edit
              </th>
              <th class="text-center">
                Hapus
              </th>
            </tr>
          </thead>
          <tbody class="align-middle">
            <tr v-for="(item, index) in result" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ item.nama_barang }}</td>
              <td class="text-center">{{ item.stok_barang }}</td>
              <td class="text-end">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga_beli).slice(0, -3) }}</td>
              <td class="text-end">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga_jual).slice(0, -3) }}</td>
              <td class="text-center">
                <button type="button" class="btn btn-sm btn-warning mb-3 mx-2" data-bs-toggle="modal" data-bs-target="#dinamyc-modal" @click="edit(item.id)"><i
                    class="bi bi-pencil text-white"></i></button>
              </td>
              <td class="text-center">
                <button type="button" class="btn btn-sm btn-danger mb-3" @click="destroy(item.id)"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :current-page="currentPage" :is-first-page="isFirstPage" :is-last-page="isLastPage" :go-to="goToPage"
      :next-page="nextPage" :page-list="pageList" :total-page="totalPage" :prev-page="prevPage" :total-data="totalData"
      v-if="result.length > 0" />
    </div>
  </div>
  <nav class="navbar shadow navbar-expand-lg navbar-light bg-light fixed-bottom">
    <div class="container pt-1 pb-1 text-dark">
      <p class="mx-auto mb-0 ">2023 - &copy; Al-Ghazali</p>
    </div>
  </nav>
</template>
<script setup lang="ts">
import Swal from '../helpers/sweetalert2';
import { onMounted, ref } from 'vue';
import Pagination from '../components/Pagination.vue';
import usePagination from '../composables/pagination';
import Modal from '../components/Modal.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { RouterLink } from 'vue-router';
import useApi from '../composables/api';
import Notify from '../helpers/notify';
import Export from '../components/Export.vue';
const query = ref('');
const {
  result,
  totalData,
  currentPage,
  totalPage,
  pageList,
  isFirstPage,
  isLastPage,
  nextPage,
  prevPage,
  goToPage,
  fetchData,
  search
} = usePagination("/barang", '', query);

onMounted(() => {
  fetchData();
});

const { meta } = useForm({
  validationSchema: {
    name: yup.string().required(),
    harga_jual: yup.number().required(),
    harga_beli: yup.number().required(),
    stok: yup.number().required(),
  },
  initialValues: {
    name: '',
    harga_jual: '',
    harga_beli: '',
    stok: '',
  },
})

const id = ref<number>(0);

const { value: name } = useField<string>('name');
const { value: harga_beli } = useField<string>('harga_beli');
const { value: harga_jual } = useField<string>('harga_jual');
const { value: stok } = useField<string>('stok');


function convertRupiah(value: string) {
  if(harga_beli.value == value) {
    harga_beli.value = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  } else if(harga_jual.value == value) {
    harga_jual.value = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return value;
}

const { postResource, deleteResource, getResource, putResource } = useApi();
const save = async () => {
  const data = {
    kode_barang: 'BRG' + Math.floor(Math.random() * 100000),
    nama_barang: name.value,
    harga_beli: harga_beli.value.replace(/\D/g, ""),
    harga_jual: harga_jual.value.replace(/\D/g, ""),
    stok_barang: stok.value,
  }
  if(id.value) {
    const response = await putResource('/barang/' + id.value, data);
    if(response) {
      Notify.success('Berhasil mengubah barang');
    }
    await fetchData();
    clearData();
    id.value = 0;
    return;
  }
  const response = await postResource('/barang', data);
  if(response) {
    Notify.success('Berhasil menambahkan barang');
  }
  await fetchData();
  clearData();
}

function clearData() {
  name.value = '';
  harga_beli.value = '';
  harga_jual.value = '';
  stok.value = '';
  id.value = 0;
}

function destroy(id: number) {
  Swal.confirm('Apakah anda yakin ingin menghapus barang ini?', async () => {
    const response = await deleteResource('/barang/' + id);
    if(response) {
      Swal.success('Berhasil menghapus barang');
      await fetchData();
    }
  });
}

const edit = async (v: number) => {
  const response = await getResource('/barang/' + v);
  id.value = v;
  if(response) {
    name.value = response.data.nama_barang;
    harga_beli.value = response.data.harga_beli.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    harga_jual.value = response.data.harga_jual.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    stok.value = response.data.stok_barang;
  }
}

const handleSearch = async () => {
  await search();
}
</script>
