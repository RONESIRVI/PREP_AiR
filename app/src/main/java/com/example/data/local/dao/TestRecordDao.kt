package com.example.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.local.entity.TestRecordEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface TestRecordDao {
    @Query("SELECT * FROM test_records ORDER BY dateStr DESC, id DESC")
    fun getAllRecords(): Flow<List<TestRecordEntity>>

    @Query("SELECT * FROM test_records WHERE id = :id LIMIT 1")
    suspend fun getRecordById(id: Long): TestRecordEntity?

    @Query("SELECT * FROM test_records WHERE subject = :subject ORDER BY dateStr DESC")
    fun getRecordsBySubject(subject: String): Flow<List<TestRecordEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecord(record: TestRecordEntity): Long

    @Update
    suspend fun updateRecord(record: TestRecordEntity)

    @Query("DELETE FROM test_records WHERE id = :id")
    suspend fun deleteRecordById(id: Long)

    @Delete
    suspend fun deleteRecord(record: TestRecordEntity)

    @Query("DELETE FROM test_records")
    suspend fun clearAllRecords()
}
